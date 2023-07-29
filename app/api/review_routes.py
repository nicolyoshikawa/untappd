from flask import Blueprint, redirect, url_for, render_template
from flask_login import login_required, current_user
from app.models import db, Review
from .auth_routes import validation_errors_to_error_messages
from app.forms.review_form import ReviewForm

review_routes = Blueprint("reviews", __name__)

# A logged in user can update one of their own reviews.
@review_routes.route("/<int:id>", methods=["PUT"])
@login_required
def update_review(id):
    review = Review.query.get(id)
    if current_user.id == review.user_id:
        form = ReviewForm()
        if form.validate_on_submit():
            updated_data = Review()
            form.populate_obj(updated_data)
            db.session.commit()
            return review.to_dict()
        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
    return {'errors': ['Unauthorized']}

# A logged in user can delete one of their own reviews, removing it from the list of visible reviews without causing a refresh/redirect.
@review_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_review(id):
    review = Review.query.get(id)
    if current_user.id == review.user_id:
        db.session.delete(review)
        db.session.commit()
        return { "message": "Review successfully deleted"}
    return {'errors': ['Unauthorized']}

# A logged in user can read a list of checkins/reviews.
@review_routes.route("/", methods=["GET"])
@login_required
def get_reviews():
    reviews = Review.query.all()
    return {'reviews': [review.to_dict() for review in reviews]}