import "./Review.css"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { loadDrinkById } from "../../store/drinks";
import OpenModalButton from "../OpenModalButton";
import { NavLink } from  "react-router-dom";
import DeleteReview from "../DeleteReview";
import EditReview from "../EditReview";

export default function Review({review}) {
    const dispatch = useDispatch()
    const {id, content, created_at, drink_id, review_img_url, stars, user_id} = review
    const drinks = useSelector(state => state.drinks)
    const drink = drinks[drink_id]
    const star = <i className="fa-solid fa-star"></i>
    const emptyStar = <i className="fa-regular fa-star"></i>
    const [showMenu, setShowMenu] = useState(true);
    const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        dispatch(loadDrinkById(drink_id))
    }, [dispatch, drink_id])

    // Calculate full and empty stars to match review rating
    let makeRating = []
    for (let i = 0; i < stars; i++) {
        makeRating.push(1)
    }
    while (makeRating.length < 5){
        makeRating.push(0)
    }

    // Change date format
    const date = new Date(created_at)
    const formatDate = date.toLocaleDateString()

    return (
        <div className="review">
            <div className="review-info">
                <div className="review-txt">
                    <div className="review-beer">
                        <span className="review-user">{user?.first_name}</span> is drinking a <NavLink to={`/drinks/${drink?.id}`}>{drink?.name}</NavLink>:
                    </div>
                    <div className="review-content">
                        {content}
                    </div>
                    <div className="review-rating">
                        {makeRating?.map((rating, el) => {
                            if (rating === 1) {
                                return <span className="star" key={el}>{star}</span>
                            }
                            return <span className="star" key={el}>{emptyStar}</span>
                        })}
                    </div>
                </div>
                <div className="beer-img">
                    <img src={drink?.drink_img_url} alt="logo"/>
                </div>
            </div>
            <div className="review-img">
                <img src={review_img_url && review_img_url} alt="review-img"/>
            </div>
            <div className="review-date">
                {formatDate}
            </div>
            {showMenu && (
                <>
                    <div className="review-edit">
                        <div className="review-edit-button">
                            <OpenModalButton
                                buttonText="Edit"
                                onItemClick={closeMenu}
                                modalComponent={<EditReview drink={drink} user={user} review={review}/>}
                            />
                        </div>
                        <div className="review-edit-button">
                            <OpenModalButton
                                buttonText="Delete"
                                onItemClick={closeMenu}
                                modalComponent={<DeleteReview review={review}/>}
                            />
                        </div>
                    </div>
                </>
            )}
            </div>
    )
}