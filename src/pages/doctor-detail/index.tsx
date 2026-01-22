import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import doctors from 'src/data/doctors.json'
import reviews from 'src/data/reviews.json'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'src/components/ui/dialog'
import { Button } from 'src/components/ui/button'
import { Star } from 'lucide-react'
import { fetchDoctorById } from '../../lib/web3/medcred.read'

type Doctor = {
  id: number
  name: string
  gender: string
  age: number
  hospital: string
  department: string
}

type Review = {
  id: number
  doctorId: number
  score: number
  text: string
}

const getAvatarUrl = (name: string, gender: string, size: number = 160) => {
  const isMale = gender === '男'
  const bgColor = isMale ? '4A90E2' : 'E91E63'
  const textColor = 'FFFFFF'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=${bgColor}&color=${textColor}&size=${size}&bold=true&font-size=0.5`
}

const DoctorDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const id = Number(params.id)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false);

  const doctor = useMemo(() => {
    const list = doctors as Doctor[]
    return list.find((d) => d.id === id)
  }, [id])

  useEffect(()=>{
    if(!id){
      return;
    }
    setLoading(true)
    fetchDoctorById(1).then((res=>{
      console.log(res);
    })).finally(()=>{
      setLoading(false)
    })
  },[id])

  const doctorReviews = useMemo(() => {
    const list = reviews as Review[]
    return list.filter((r) => r.doctorId === id)
  }, [id])

  const handleSubmitReview = () => {
    if (rating === 0) {
      alert('请选择评分')
      return
    }
    if (!reviewText.trim()) {
      alert('请输入评价内容')
      return
    }
    // 这里可以添加提交逻辑，比如调用API
    console.log('提交评价:', { doctorId: id, score: rating, text: reviewText })
    alert('评价提交成功！')
    setIsDialogOpen(false)
    setRating(0)
    setReviewText('')
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setRating(0)
    setHoverRating(0)
    setReviewText('')
  }

  if (!doctor) {
    return (
      <div className='min-h-screen bg-slate-50'>
        <div className='mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center'>
          <p className='text-lg font-medium text-slate-800'>未找到该医生信息</p>
          <p className='mt-2 text-sm text-slate-500'>可能是链接有误或数据暂未录入</p>
          <button
            onClick={() => navigate(-1)}
            className='mt-6 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700'
          >
            返回上一页
          </button>
        </div>
      </div>
    )
  }

  const avgScore =
    doctorReviews.length > 0
      ? doctorReviews.reduce((sum, r) => sum + r.score, 0) / doctorReviews.length
      : null

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50'>
      <div className='mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8'>
        {/* 顶部返回 */}
        <div className='mb-6 flex items-center justify-between'>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center text-sm text-slate-500 hover:text-slate-700'
          >
            <span className='mr-1 text-lg'>{'←'}</span>
            返回
          </button>
          <Link
            to='/'
            className='text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline'
          >
            回到医生列表
          </Link>
        </div>

        {/* 医生基础信息卡片 */}
        <section className='mb-8 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/70'>
          <div className='flex flex-col gap-6 px-6 py-8 sm:flex-row sm:px-10 sm:py-10'>
            <div className='flex flex-col items-center sm:w-1/3'>
              <div className='relative'>
                <img
                  src={getAvatarUrl(doctor.name, doctor.gender, 200)}
                  alt={doctor.name}
                  className='h-36 w-36 rounded-full border-4 border-white shadow-lg ring-4 ring-blue-50 sm:h-44 sm:w-44'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor.name,
                    )}&size=200`
                  }}
                />
                <div
                  className={`absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-white ${
                    doctor.gender === '男' ? 'bg-blue-500' : 'bg-pink-500'
                  }`}
                >
                  {doctor.gender === '男' ? '♂' : '♀'}
                </div>
              </div>
              <div className='mt-4 text-center'>
                <h1 className='text-xl font-bold text-slate-900 sm:text-2xl'>{doctor.name}</h1>
                <p className='mt-1 text-sm text-slate-500'>
                  {doctor.age} 岁 · {doctor.department}
                </p>
              </div>
            </div>

            <div className='flex-1 space-y-4 sm:w-2/3'>
              <div className='rounded-2xl bg-slate-50 p-4'>
                <h2 className='mb-2 text-sm font-semibold text-slate-700'>基本信息</h2>
                <div className='grid gap-3 text-sm text-slate-600 sm:grid-cols-2'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex h-2 w-2 rounded-full bg-emerald-500'></span>
                    <span>在诊状态：接诊中</span>
                  </div>
                  <div>性别：{doctor.gender}</div>
                  <div>年龄：{doctor.age} 岁</div>
                  <div>所在医院：{doctor.hospital}</div>
                  <div>所在科室：{doctor.department}</div>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-4'>
                {avgScore && (
                  <div className='rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3 text-white shadow-md'>
                    <div className='text-xs uppercase tracking-wide opacity-90'>综合评分</div>
                    <div className='mt-1 flex items-baseline gap-1'>
                      <span className='text-2xl font-semibold'>{avgScore.toFixed(1)}</span>
                      <span className='text-xs opacity-90'>
                        / 5 · {doctorReviews.length} 条评价
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 评价列表 */}
        <section>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-semibold text-slate-900'>患者评价</h2>
            <div className='flex items-center gap-3'>
              <span className='text-xs text-slate-500'>
                共 {doctorReviews.length} 条评价（示例数据）
              </span>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className='bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40'
              >
                <Star className='mr-2 h-4 w-4 fill-current' />
                填写评价
              </Button>
            </div>
          </div>

          {doctorReviews.length === 0 ? (
            <div className='rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500'>
              暂无评价数据
            </div>
          ) : (
            <div className='space-y-4'>
              {doctorReviews.map((review) => (
                <article
                  key={review.id}
                  className='rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100'
                >
                  <div className='mb-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= review.score ? 'text-amber-400' : 'text-slate-200'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className='text-xs font-medium text-amber-500'>
                        {review.score.toFixed(1)} 分
                      </span>
                    </div>
                    <span className='text-xs text-slate-400'>匿名患者</span>
                  </div>
                  <p className='text-sm leading-relaxed text-slate-700'>{review.text}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 填写评价对话框 */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='max-w-md rounded-2xl border-0 bg-white p-0 shadow-2xl sm:max-w-lg'>
            <DialogHeader className='rounded-t-2xl bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5'>
              <DialogTitle className='text-xl font-bold text-slate-900'>
                为 {doctor.name} 医生评价
              </DialogTitle>
              <DialogDescription className='text-sm text-slate-600'>
                您的评价将帮助其他患者更好地了解这位医生
              </DialogDescription>
            </DialogHeader>

            <div className='px-6 py-6'>
              {/* 评分选择 */}
              <div className='mb-6'>
                <label className='mb-3 block text-sm font-semibold text-slate-700'>
                  评分 <span className='text-red-500'>*</span>
                </label>
                <div className='flex items-center gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className='transition-transform hover:scale-110 active:scale-95'
                    >
                      <Star
                        className={`h-10 w-10 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className='ml-2 text-sm font-medium text-amber-600'>
                      {rating}.0 分
                    </span>
                  )}
                </div>
                {rating === 0 && (
                  <p className='mt-2 text-xs text-slate-400'>请点击星星进行评分</p>
                )}
              </div>

              {/* 评价内容输入 */}
              <div>
                <label className='mb-3 block text-sm font-semibold text-slate-700'>
                  评价内容 <span className='text-red-500'>*</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder='请分享您对这位医生的就诊体验，包括服务态度、专业水平、治疗效果等方面的感受...'
                  className='min-h-[120px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20'
                  maxLength={500}
                />
                <div className='mt-2 flex items-center justify-between'>
                  <p className='text-xs text-slate-400'>
                    您的评价将匿名展示，请文明用语
                  </p>
                  <span
                    className={`text-xs ${
                      reviewText.length > 450 ? 'text-amber-500' : 'text-slate-400'
                    }`}
                  >
                    {reviewText.length}/500
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className='gap-2 border-t border-slate-100 px-6 py-4'>
              <Button
                variant='outline'
                onClick={handleDialogClose}
                className='rounded-lg border-slate-200 hover:bg-slate-50'
              >
                取消
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || !reviewText.trim()}
                className='rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                提交评价
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default DoctorDetail


