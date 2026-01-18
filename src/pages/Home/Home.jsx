import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Process from "./components/Process";
import FAQ from "./components/FAQ";

import Footer from "./components/Footer";

const Home = () => {
    return(
        <>
            <Navbar />
            {/* Animation d'apparition initiale pour Hero */}
            <div data-aos="fade-in" data-aos-duration="1200">
                <Hero />
            </div>

            {/* Animations au scroll pour les autres sections */}
            <div data-aos="fade-up" data-aos-duration="400">
                <About />
            </div>
            <div data-aos="fade-up" data-aos-duration="400">
                <Process />
            </div>
            <div data-aos="fade-up" data-aos-duration="400">
                <FAQ />
            </div>
            <Footer />
        </>
    );
}

export default Home;