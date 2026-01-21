import { JsonRpcProvider, Contract } from "ethers";
import MedCredAbi from "@/abi/MedCred.json";

// Doctor 结构（按 ABI 的 doctors(id) struct 来做兼容解析）
export type Doctor = {
  id: number;
  hospital: string;
  department: string;
  rank: number; // uint8 enum
  name: string;
  exists: boolean;
};

function getRpcUrl(): string {
  const url = import.meta.env.VITE_SEPOLIA_RPC_URL as string | undefined;
  if (!url) throw new Error("缺少环境变量：VITE_SEPOLIA_RPC_URL");
  return url;
}

function getMedCredAddress(): string {
  const addr = import.meta.env.VITE_MEDCRED_ADDRESS as string | undefined;
  if (!addr) throw new Error("缺少环境变量：VITE_MEDCRED_ADDRESS（MedCred 主合约地址）");
  return addr;
}

function getProvider() {
  return new JsonRpcProvider(getRpcUrl());
}

function getMedCredReadContract() {
  const provider = getProvider();
  // MedCred.json 是一个对象，包含 abi 字段，需要提取 abi 数组
  return new Contract(getMedCredAddress(), (MedCredAbi as any).abi, provider);
}

// 兼容 ethers 返回：可能是数组，也可能含命名字段
function pick<T>(obj: any, key: string, index: number): T {
  return (obj?.[key] ?? obj?.[index]) as T;
}

// 获取医生总数
export async function fetchDoctorCount(): Promise<number> {
  const c = getMedCredReadContract();
  const count: bigint = await c.doctorCount();
  return Number(count);
}

// 获取单个医生
export async function fetchDoctorById(id: number): Promise<Doctor | null> {
  try {
    const c = getMedCredReadContract();
    const d = await c.doctors(BigInt(id));

    // 根据 ABI，doctors 返回: hospital, department, rank, name, exists
    const exists = pick<boolean>(d, "exists", 4);
    
    // 如果医生不存在，返回 null
    if (!exists) {
      return null;
    }

    return {
      id,
      hospital: pick<string>(d, "hospital", 0),
      department: pick<string>(d, "department", 1),
      rank: Number(pick<bigint>(d, "rank", 2)), // uint8 enum 转为 number
      name: pick<string>(d, "name", 3),
      exists: true,
    };
  } catch (error) {
    console.error(`获取医生 ${id} 失败:`, error);
    return null;
  }
}

/**
 * 获取全部医生
 * - 默认从 1 开始（多数合约喜欢从 1 计数）
 * - 如果你发现第一个医生取不到，把 startId 改成 0
 */
export async function fetchAllDoctors(options?: {
  startId?: number;
  onlyActive?: boolean;
  concurrency?: number; // 简单限流，避免医生很多时 RPC 压力过大
}): Promise<Doctor[]> {
  const startId = options?.startId ?? 1;
  const onlyActive = options?.onlyActive ?? false;
  const concurrency = Math.max(1, options?.concurrency ?? 8);

  const count = await fetchDoctorCount();
  if (count <= 0) return [];

  // 生成 id 列表
  const ids: number[] = [];
  for (let id = startId; id <= count; id++) ids.push(id);

  // 简易并发池（生产足够用）
  const results: Doctor[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < ids.length) {
      const idx = cursor++;
      const id = ids[idx];
      const doc = await fetchDoctorById(id);
      // 只保存存在的医生
      if (doc) {
        results[idx] = doc;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, ids.length) }, worker));

  const list = results.filter(Boolean);
  // 使用 exists 字段而不是 isActive
  return onlyActive ? list.filter((x) => x.exists) : list;
}
