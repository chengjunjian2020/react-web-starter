import { fetchAllDoctors, fetchDoctorById } from "@/lib/web3/medcred.read";
import { useEffect } from "react";

const Test = () => {
    useEffect(() => {
        let alive = true;

        async function loadDoctors() {
            try {
                const list = await fetchDoctorById(1);
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