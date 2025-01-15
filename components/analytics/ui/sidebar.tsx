import React, { useState } from "react";
import { AnalyticsResponse } from "@/lib/analytics/models/review";
import RatingStars from "@/components/ui/RatingStars";

interface SidebarProps {
    data: AnalyticsResponse
    handleClick: (string) => void
}


const Sidebar = ({
        data,
        handleClick
        }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative pt-4">
            {/* Button to toggle the sidebar */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-8 left-4 z-50 bg-teal-600 text-white p-3 rounded"
            >
                {isOpen ? "Close" : "Select Metric for Graph"}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-40 transform transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
                onClick={toggleSidebar}
            >
                {/* Sidebar content */}
                <div
                className={`w-96 h-full bg-white shadow-lg p-4 fixed left-0 top-0 transform transition-all duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                >
                    <div
                        className='h-48 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
                        onClick={() => handleClick('review')}
                    >
                        <div className='bold flex items-center justify-center pb-6 pt-2 text-xl underline'>
                            Total Reviews
                        </div>
                        <div className='grid w-full grid-cols-3 gap-2'>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 90 Days:</div>
                                <div className='text-lg'>
                                    {data.totalReviewsT90
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 180 Days:</div>
                                <div className='text-lg'>
                                    {data.totalReviewsT180
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 360 Days:</div>
                                <div className='text-lg'>
                                    {data.totalReviewsT360
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='h-4'></div>
                    <div
                        className='h-48 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
                        onClick={() => handleClick('rating')}
                    >
                        <div className='bold flex items-center justify-center pb-6 pt-2 text-xl underline'>
                            Average Rating
                        </div>
                        <div className='grid w-full grid-cols-3 gap-2'>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 90 Days:</div>
                                <div>
                                    <RatingStars
                                        testid='AnalyticsSidebar90DayRatingStar'
                                        value={Math.floor(data.avgRatingT90)}
                                    />
                                </div>
                            </div>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 180 Days:</div>
                                <RatingStars
                                    testid='AnalyticsSidebar180DayRatingStar'
                                    value={Math.floor(data.avgRatingT180)}
                                />
                            </div>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 360 Days:</div>
                                <RatingStars
                                    testid='AnalyticsSidebar360DayRatingStar'
                                    value={Math.floor(data.avgRatingT360)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='h-4'></div>
                    <div
                        className='h-48 rounded-lg border-4 border-teal-600 bg-white p-4 hover:cursor-pointer hover:opacity-70 hover:shadow-lg'
                        onClick={() => handleClick('median')}
                    >
                        <div className='bold flex items-center justify-center pb-6 pt-2 text-xl underline'>
                            Median Reported Rent
                        </div>
                        <div className='grid w-full grid-cols-3 gap-2'>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 90 Days:</div>
                                <div className="text-lg">
                                    $
                                    {data.medianRentT90
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 180 Days:</div>
                                <div className="text-lg">
                                    ${data.medianRentT180
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                            <div className='flex h-24 flex-col items-center justify-center rounded-lg border border-teal-600 bg-teal-600/5 text-sm'>
                                <div>Last 360 Days:</div>
                                <div className="text-lg">
                                ${data.medianRentT360
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;