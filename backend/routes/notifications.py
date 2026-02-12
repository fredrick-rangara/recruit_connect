from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications]), 200

@notifications_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def mark_read(id):
    user_id = get_jwt_identity()
    n = Notification.query.filter_by(id=id, user_id=user_id).first_or_404()
    n.read = True
    db.session.commit()
    return jsonify(n.to_dict()), 200

@notifications_bp.route('/mark-all-read', methods=['PATCH'])
@jwt_required()
def mark_all_read():
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id, read=False).update({Notification.read: True})
    db.session.commit()
    return jsonify({"msg": "All marked as read"}), 200
