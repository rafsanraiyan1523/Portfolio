import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Credentials from "@/components/sections/Credentials";
import Experience from "@/components/sections/Experience";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Impact from "@/components/sections/Impact";
import Nav from "@/components/sections/Nav";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Work />
        <Impact />
        <Experience />
        <Process />
        <Credentials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
