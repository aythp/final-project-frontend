import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/auth.context";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { BsCheck2 } from 'react-icons/bs';

export default function ManualCarousel({ mediaType, timeWindow }) {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [savedItems, setSavedItems] = useState({});
    const [addingItem, setAddingItem] = useState(null);
    const [removingItem, setRemovingItem] = useState(null);
    const [savedItemIds, setSavedItemIds] = useState({});
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
                
                if (isLoggedIn) {
                    await checkSavedItems(response.data.results.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [mediaType, timeWindow, API_KEY, isLoggedIn]);
    
    const checkSavedItems = async (mediaItems) => {
        try {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) return;
            
            const endpoint = mediaType === 'movie' ? 'movies' : 'series';
            const savedItemsObj = {};
            const savedItemIdsObj = {};
            
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/api/${endpoint}`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            const userItems = response.data;
            console.log('User items:', userItems);
            
            mediaItems.forEach(item => {
                const title = mediaType === 'movie' ? item.title : item.name;
                const matchingItem = userItems.find(userItem => 
                    (userItem.tmdbId && userItem.tmdbId.toString() === item.id.toString()) ||
                    userItem.title.toLowerCase() === title.toLowerCase()
                );
                
                const isSaved = !!matchingItem;
                savedItemsObj[item.id] = isSaved;
                
                if (isSaved && matchingItem) {
                    console.log(`Found saved item: ${title} with ID: ${matchingItem._id}`);
                    savedItemIdsObj[item.id] = matchingItem._id;
                }
            });
            
            console.log('Saved items map:', savedItemsObj);
            console.log('Saved item IDs map:', savedItemIdsObj);
            
            setSavedItems(savedItemsObj);
            setSavedItemIds(savedItemIdsObj);
        } catch (error) {
            console.error('Error checking saved items:', error);
        }
    };

    const handleAddToList = async (item) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
    
        try {
            setAddingItem(item.id);
            const authToken = localStorage.getItem("authToken");
            const endpoint = mediaType === 'movie' ? 'movies' : 'series';
            const query = mediaType === 'movie' ? item.title : item.name;
            
            console.log(`Attempting to add ${mediaType} with TMDB ID: ${item.id}`);
    
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/${endpoint}/search`,
                { 
                    query,
                    tmdbId: item.id 
                },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            console.log('Add response:', response.data);
            
            
            const savedItemId = response.data._id;
            
            
            setSavedItems(prev => ({
                ...prev,
                [item.id]: true
            }));
            setSavedItemIds(prev => ({
                ...prev,
                [item.id]: savedItemId
            }));
            
            console.log(`Successfully added ${mediaType} to list with MongoDB ID: ${savedItemId}`);
        } catch (error) {
            console.error('Error adding to list:', error);
            console.error('Error details:', error.response?.data || 'No response data');
        } finally {
            setAddingItem(null);
        }
    };

    const handleRemoveFromList = async (item) => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
    
        try {
            setRemovingItem(item.id);
            const authToken = localStorage.getItem("authToken");
            const endpoint = mediaType === 'movie' ? 'movies' : 'series';
            const savedItemId = savedItemIds[item.id];
            
            console.log(`Attempting to remove ${mediaType} with TMDB ID: ${item.id}`);
            console.log(`MongoDB ID for deletion: ${savedItemId}`);
            
            if (!savedItemId) {
                console.error('No saved item ID found for this item. Refreshing saved items...');
                
                await checkSavedItems([item]);
                return;
            }
    
            const response = await axios.delete(
                `${process.env.REACT_APP_SERVER_URL}/api/${endpoint}/${savedItemId}`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            
            console.log('Delete response:', response.data);
            
            
            setSavedItems(prev => ({
                ...prev,
                [item.id]: false
            }));
            setSavedItemIds(prev => {
                const newState = { ...prev };
                delete newState[item.id]; 
                return newState;
            });
            
            console.log(`Successfully removed ${mediaType} from list`);
        } catch (error) {
            console.error('Error removing from list:', error);
            console.error('Error details:', error.response?.data || 'No response data');
            
            if (error.response?.status === 404) {
                setSavedItems(prev => ({
                    ...prev,
                    [item.id]: false
                }));
                setSavedItemIds(prev => {
                    const newState = { ...prev };
                    delete newState[item.id];
                    return newState;
                });
            }
        } finally {
            setRemovingItem(null);
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
                                        onClick={() => !savedItems[item.id] ? handleAddToList(item) : handleRemoveFromList(item)}
                                        className={`btn ${savedItems[item.id] ? 'btn-error' : 'btn-primary'} btn-lg gap-2 hover:scale-105 transition-transform`}
                                        disabled={addingItem === item.id || removingItem === item.id}
                                    >
                                        {addingItem === item.id ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : removingItem === item.id ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : savedItems[item.id] ? (
                                            <>
                                                <BsCheck2 className="h-6 w-6" />
                                                Eliminar de mi lista
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Añadir a mi lista
                                            </>
                                        )}
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