import React from 'react'

type Props = { chatId: number };

const SummaryComponent = ({ chatId }: Props) => {
  return (
    <div className="bg-gray-100 flex flex-col gap-4 p-6 h-full justify-around">
      {/* Summary Section */}
      <div className="p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer h-1/2 scroll-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
        <p className="text-gray-600">
          {/* Placeholder text, replace with actual summary */}
          This is the summary of the chat or document. It will provide an overview of the key points.
        </p>
      </div>
      
      {/* Related Information Section */}
      <div className=" p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer h-1/2 scroll-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Related Information</h2>
        <p className="text-gray-600">
          {/* Placeholder text, replace with actual related information */}
          Here is some related information or links that provide additional context or resources.
        </p>
      </div>
    </div>
  )
}

export default SummaryComponent;
