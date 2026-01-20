import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import doctors from 'src/data/doctors.json'

type Doctor = {
  id: number
  name: string
  gender: string
  age: number
  hospital: string
  department: string
}

const departments = [
  '全部科室',
  '内科',
  '外科',
  '妇产科',
  '儿科',
  '骨科',
  '眼科',
  '口腔科',
  '皮肤科',
  '耳鼻喉科',
  '心血管内科',
  '神经外科',
  '消化内科',
  '呼吸科',
  '心理科',
  '普外科',
]

// 根据性别获取头像URL
const getAvatarUrl = (name: string, gender: string) => {
  const isMale = gender === '男'
  // 使用 ui-avatars.com 生成头像，根据性别使用不同颜色
  const bgColor = isMale ? '4A90E2' : 'E91E63' // 男性用蓝色，女性用粉色
  const textColor = 'FFFFFF'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=${textColor}&size=120&bold=true&font-size=0.5`
}

const Home = () => {
  const [activeDept, setActiveDept] = useState<string>('全部科室')

  const doctorList = useMemo(() => {
    const allDoctors = doctors as Doctor[]
    if (activeDept === '全部科室') return allDoctors
    return allDoctors.filter((d) => d.department === activeDept)
  }, [activeDept])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* 标题区域 */}
        <header className='mb-10 text-center'>
          <h1 className='mb-3 text-4xl font-bold text-slate-900 sm:text-5xl'>
            专业医生评价
          </h1>
          <p className='mx-auto max-w-2xl text-base text-slate-600 sm:text-lg'>
            汇集权威医疗专家，真实患者评价，为您提供可靠的就医参考
          </p>
        </header>

        {/* 科室筛选 */}
        <section className='mb-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/50'>
          <div className='mb-4 text-sm font-semibold text-slate-700 sm:text-base'>科室筛选：</div>
          <div className='flex flex-wrap gap-2.5'>
            {departments.map((dept) => {
              const isActive = dept === activeDept
              return (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {dept}
                </button>
              )
            })}
          </div>
        </section>

        {/* 医生列表 */}
        <section className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {doctorList.map((doctor) => (
            <Link key={doctor.id} to={`/doctor/${doctor.id}`} className='block'>
              <article className='group relative h-full overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10'>
                {/* 头像和信息 */}
                <div className='mb-4 flex items-start gap-4'>
                  <div className='relative flex-shrink-0'>
                    <img
                      src={getAvatarUrl(doctor.name, doctor.gender)}
                      alt={doctor.name}
                      className='h-16 w-16 rounded-full ring-2 ring-slate-100 transition-all duration-300 group-hover:ring-blue-200'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&size=120`
                      }}
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white ${
                        doctor.gender === '男' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}
                    >
                      {doctor.gender === '男' ? '♂' : '♀'}
                    </div>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='mb-1 flex items-baseline gap-2'>
                      <h2 className='truncate text-lg font-bold text-slate-900'>{doctor.name}</h2>
                    </div>
                    <div className='mb-2 flex items-center gap-2'>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          doctor.gender === '男'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {doctor.gender}
                      </span>
                      <span className='text-sm text-slate-500'>{doctor.age} 岁</span>
                    </div>
                  </div>
                </div>

                {/* 医院和科室信息 */}
                <div className='space-y-2 border-t border-slate-100 pt-4'>
                  <div className='flex items-start gap-2'>
                    <svg
                      className='mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                      />
                    </svg>
                    <span className='text-sm font-medium text-slate-700'>{doctor.hospital}</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <svg
                      className='mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    <span className='text-sm text-slate-600'>{doctor.department}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}

          {doctorList.length === 0 && (
            <div className='col-span-full rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center'>
              <svg
                className='mx-auto h-12 w-12 text-slate-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='mt-4 text-base font-medium text-slate-500'>暂无该科室医生评价</p>
              <p className='mt-1 text-sm text-slate-400'>请尝试选择其他科室</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Home