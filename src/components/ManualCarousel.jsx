import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

export default function ManualCarousel({ mediaType, timeWindow }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const searchRef = useRef(null);

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    const BASE_URL = "https://api.themoviedb.org/3";

    useEffect(() => {
        const fetchData = async () => {
            if (!API_KEY) {
                console.error('TMDB API Key no está configurada');
                setLoading(false);
                return;
            }

            try {
                let endpoint;
                if (timeWindow === 'week') {
                    endpoint = '/trending/' + mediaType + '/week';
                } else if (timeWindow === 'year') {
                    endpoint = `/${mediaType}/popular`;
                } else {
                    endpoint = `/${mediaType}/top_rated`;
                }

                const response = await axios.get(`${BASE_URL}${endpoint}`, {
                    params: {
                        api_key: API_KEY,
                        language: 'es-ES'
                    }
                });

                setItems(response.data.results.slice(0, 5));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mediaType, timeWindow, API_KEY]);

    const handleAddToList = async (item) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
    
        try {
            const authToken = localStorage.getItem("authToken");
            const endpoint = mediaType === 'movie' ? 'movies' : 'series';
            const query = mediaType === 'movie' ? item.title : item.name;
    
            await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/${endpoint}/search`,
                { query },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
        } catch (error) {
            console.error('Error adding to list:', error);
        }
    };

    const goToSlide = (index) => {
        setActiveIndex(index);
    };

    const goToPrevSlide = () => {
        const newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(newIndex);
    };

    const goToNextSlide = () => {
        const newIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(newIndex);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-xl shadow-2xl">
            <div className="carousel w-full h-[75vh]">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        className={`carousel-item absolute w-full h-full transition-opacity duration-500 ${
                            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: index === activeIndex ? 1 : 0,
                            scale: index === activeIndex ? 1 : 0.95
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="relative w-full h-full">
                            <img
                                src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                                alt={item.title || item.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-8 md:p-12">
                                <motion.h2 
                                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    {item.title || item.name}
                                </motion.h2>
                                <motion.p 
                                    className="text-white text-lg mb-6 line-clamp-3 md:line-clamp-4"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    {item.overview}
                                </motion.p>
                                <motion.div 
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="badge badge-lg badge-primary p-3 font-semibold">
                                            {item.vote_average.toFixed(1)} 
                                        </div>
                                        <div className="badge badge-lg badge-secondary p-3">
                                            {mediaType === 'movie' ? 'Película' : 'Serie'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddToList(item)}
                                        className="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Añadir a mi lista
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Navigation arrows */}
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between z-20">
                <button
                    onClick={goToPrevSlide}
                    className="btn btn-circle bg-black/30 border-none text-white hover:bg-primary hover:scale-110 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={goToNextSlide}
                    className="btn btn-circle bg-black/30 border-none text-white hover:bg-primary hover:scale-110 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                            index === activeIndex 
                                ? 'bg-primary scale-125' 
                                : 'bg-white/50 hover:bg-white'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}