import Calendar from "@/components/Calendar";
import { fetchPoopCalendar } from "@/requests/fetchPoopCalendar";
import { PoopCalendar } from "@/types/PoopCalendar";

export default async function Home() {


    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <Calendar />
        </div>
    );
}