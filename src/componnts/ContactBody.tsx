export default function ContactUs() {
  return (
    <div className="w-full h-full">
      <div className="max-w-prose mx-auto mt-10 p-9 shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Contact Us
        </h2>

        <ul className="space-y-3 text-gray-700">
          <li className="flex flex-col">
            <span className="font-medium text-gray-900">Address :</span>
            <span className="text-sm">
              96 D/1 Namaluwa, Kothalawala, Bandaragama.
            </span>
          </li>

          <li className="flex flex-col">
            <span className="font-medium text-gray-900">Mobile :</span>
            <span className="text-sm">+78 713 5526</span>
          </li>

          <li className="flex flex-col">
            <span className="font-medium text-gray-900">Email :</span>
            <span className="text-sm">Dinuka0512@gmail.com</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
