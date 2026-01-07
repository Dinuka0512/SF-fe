import banner from "../assets/b.jpg";

export default function 
() {
  return (
    <div>
         {/* Banner */}
        <div className="p-6">
            <div
            className="w-full aspect-[16/5] bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${banner})` }}
            ></div>
        </div>
    </div>
  )
}
