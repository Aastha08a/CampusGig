import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import CategorySection from '../components/home/CategorySection';
import RecommendedGigs from '../components/home/RecommendedGigs';

import './Home.css';

function Home() {
    return (
        <div className="home-page">
            <Navbar />
            <main>
                <Hero />
                <CategorySection />
                <RecommendedGigs />
            </main>
        </div>
    );
}

export default Home;
