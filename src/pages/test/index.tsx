import { fetchAllDoctors } from "@/lib/web3/medcred.read";
import { useEffect } from "react";

const Test = () => {
    useEffect(() => {
        let alive = true;

        async function loadDoctors() {
            try {
                const list = await fetchAllDoctors({
                    startId: 1,        // 如果你发现第一个医生取不到，改成 0
                    onlyActive: true,  // 只要启用的医生
                    concurrency: 6,    // RPC 并发数，Infura 建议 5~8
                });
                console.log(list)

                // if (alive) {
                //     setDoctors(list);
                // }
            } catch (e: any) {
                if (alive) {
                    console.log(e?.message ?? "获取医生失败");
                }
            }
        }

        loadDoctors();

        return () => {
            alive = false;
        };
    }, []);
    return <div>Test</div>
}

export default Test