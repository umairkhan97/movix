
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import "./detailsBanner.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadimages/Img";
import PosterFallback from "../../../assets/no-poster.png";
import {PlayIcon} from './Playbtn'
import VideoPopup from "../../../components/videoPopup/VideoPopup";



const DetailsBanner = ({ video, crew }) => {


    const {mediaType, id} = useParams();  
    const {data, loading} = useFetch(`/${mediaType}/${id}`)

    const {url} = useSelector((state) => state.home);

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };

    // genres 

    const _genres = data?.genres?.map((g)=> g.id);

    const director= crew?.filter((f) => f.job === "Director");
    const writer = crew?.filter((f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer")

    // popum state

    const [show, setshow]= useState(false);
    const [videoId, setVideoId] =useState(null);


    return (
        <div className="detailsBanner">
            {!loading ? (
                <>
                  {!!data && (
                    <React.Fragment>
                            <div className="backdrop-img">
                                <Img src ={url.backdrop + data?.backdrop_path} />
                            </div>
                            <div className="opacity-layer"></div>
                             <ContentWrapper>
                                <div className="content">
                                    <div className="left">
                                        {data.poster_path ? (
                                            <Img className='posterImg'
                                            src={url.backdrop + 
                                            data.poster_path} />
                                        ) :(

                                            <Img className='posterImg'
                                            src={PosterFallback} />

                                        ) }
                                    </div>

                                    <div className="right">
                                            <div className="title">
                                                {`${data.name || data.title} (${dayjs(data?.release_date).format("YYYY")}) `}
                                            </div>

                                            <div className="subtitle">
                                                {data.tagline}
                                            </div>

                                            <Genres data = {_genres} />

                                            <div className="row">
                                                    <CircleRating 
                                                      rating= {data.vote_average.toFixed(1)}
                                                    />

                                                    <div className="playbtn" onClick={()=> {
                                                        setshow(true)
                                                        setVideoId(video.key)

                                                    }}
                                                    >
                                                        <PlayIcon/>
                                                        <span className="text"> Watch Trailer </span>
                                                    </div>
                                            </div>
                                            <div className="overview">
                                                <div className="heading">
                                                    Overview
                                                </div>
                                                <div className="description">
                                                    {data. overview}
                                                </div>
                                            </div>
                                            <div className="info">
                                                {data.status && (
                                                    <div className="infoItem">
                                                        <div className="text bold">
                                                             <span>   Status : { " "} </span>
                                                             <span className="text"> {data.status} </span>
                                                        </div>
                                                    </div>
                                                )}
 
                                                {data.release_date && (
                                                    <div className="infoItem">
                                                        <div className="text bold">
                                                             <span>  Release Date: { " "} </span>
                                                             <span className="text"> {dayjs(data.release_date).format("MMM D, YYYY")} </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {data.runtime && (
                                                    <div className="infoItem">
                                                        <div className="text bold">
                                                             <span>  Runtime: { " "} </span>
                                                             <span className="text"> { toHoursAndMinutes(data.runtime)} </span> 
                                                        </div>
                                                    </div>
                                                )}

                                            </div>

                                            {director?.length > 0 && (
                                                <div className="info">
                                                    <span className="text bold">
                                                            Director: {" "}
                                                    </span>
                                                    <div className="text">
                                                        {director.map((d, i)=>(
                                                            <span key = {i}> 
                                                             {d.name}
                                                             {director.length-1 !== i && ", "}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                   
                                            {writer?.length > 0 && (
                                                <div className="info">
                                                    <span className="text bold">
                                                            Writer: {" "}
                                                    </span>
                                                    <div className="text">
                                                        {writer.map((d, i)=>(
                                                            <span key = {i}> 
                                                             {d.name}
                                                             {writer.length-1 !== i && ", "}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {data?.created_by?.length > 0 && (
                                                <div className="info">
                                                    <span className="text bold">
                                                            Creator:{" "}
                                                    </span>
                                                    <div className="text">
                                                        {data?.created_by?.map((d, i)=>(
                                                            <span key = {i}> 
                                                             {d.name}
                                                             {data?.created_by?.length-1 !== i && ", "}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}


                                            
                                    </div>
                                </div>

                                      <VideoPopup 
                                      show={show}
                                      setShow={setshow}
                                      videoId={videoId}
                                      setVideoId={setVideoId}
                                       />                      

                             </ContentWrapper>
                    </React.Fragment>
                  )}
                </>
            ) : (
                <div className="detailsBannerSkeleton">
                    <ContentWrapper>
                        <div className="left skeleton"></div>
                        <div className="right">
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </div>
    );
};

export default DetailsBanner;