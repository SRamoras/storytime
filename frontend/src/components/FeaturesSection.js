import React from "react";
import './FeaturesSection.css';
import { FaBook, FaPenFancy, FaHandshake, FaGlobe } from "react-icons/fa"; // Ícones do react-icons

const FeaturesSection = () => {
    const features = [
        {
            title: "Discover",
            description: "Find engaging and immersive stories from all over the world.",
            icon: <FaBook />, // Ícone de livro
        },
        {
            title: "Write",
            description: "Share your creativity by writing your own stories.",
            icon: <FaPenFancy />, // Ícone de escrita
        },
        {
            title: "Connect",
            description: "Build connections with like-minded readers and authors.",
            icon: <FaHandshake />, // Ícone de conexão
        },
        {
            title: "Explore",
            description: "Dive into different genres and expand your imagination.",
            icon: <FaGlobe />, // Ícone de exploração
        },
    ];

    return (
        <section className="features-section">
            <div className="features-header">
                <h2>One Platform. Infinite Stories.</h2>
                <p>
                    Discover a world of creativity and connection. Whether you're a reader looking for captivating tales, a writer eager to share your vision, or someone who simply loves exploring new ideas, this platform is your gateway to endless possibilities. Join a community of storytellers and readers who inspire, create, and connect through the power of words.
                </p>
            </div>
            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturesSection;
