import clsx from 'clsx'

interface IProps {
  icon: string
  className?: string
  size?: number|string
  color?: string
}
const Iconfont: React.FC<IProps> = ({ icon, size, className, color }) => {
  return (
    <i
      style={{
        fontSize: size,
      }}
      className={clsx('iconfont', icon, className, color && `text-[${color}]`)}
    ></i>
  )
}

export default Iconfont;