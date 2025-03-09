import Footer from "../components/Footer"
import Sidebar from "../components/Sidebar"
import MovieSearch from '../components/MovieSearch';
import SeriesSearch from '../components/SeriesSearch';
export default function ProfilePage(){
    return (
        <>
<div className="flex justify-start min-h-screen bg-slate-600">
 <Sidebar/>
 <MovieSearch/>
 <SeriesSearch/>
</div>
            <Footer />
        </>
    )
}