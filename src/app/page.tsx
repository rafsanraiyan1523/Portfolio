import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Impact from "@/components/sections/Impact";
import Nav from "@/components/sections/Nav";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Impact />
        <Work />
        <Services />
        <Process />
        <Experience />
        <Skills />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
