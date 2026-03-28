import { cn } from '@/lib/utils'
import Image from 'next/image'

interface HomeCardProps {
    img: string, 
    title: string, 
    description: string,
    className: string,  
    handleClick: () => void
}

const HomeCard = ({ img, title, description, handleClick, className }: HomeCardProps) => {
    return (
        <div className={cn('px-4 py-3 flex flex-col justify-between w-full xl:max-w-[270px] min-h-48 rounded-xl cursor-pointer', className)}
            onClick={handleClick}>

            <div className="glassmorphism flex-center size-12 rounded-xl">
                <Image src={img} width={24} height={24} alt="add meeting" />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-lg font-normal">{description}</p>
            </div>

        </div>
    )
}

export default HomeCard