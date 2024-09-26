from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client['company']
users_collection = db['users']
temp_users_collection = db['temp-users']
carts_collection = db['carts']
verification_code = random.randint(100000, 999999)


def send_welcome_email(to_email, name):
    smtp_server = 'smtp-mail.outlook.com'
    smtp_port = 587
    sender_email = 'myEmail'
    sender_password = 'myPassword.'


    subject = 'Welcome to InfiniteDeals!'
    body = f'Hello {name}!,\n\nPlease verify your email.\nThis is your six digit verification number: {verification_code}.'

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    print(verification_code)
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
        print("Welcome email sent successfully!")
    except Exception as e:
        print(f"An error occurred while sending an email: {e}")

@app.route("/users", methods=["GET"])
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return jsonify({"users": users})

@app.route("/users-temp", methods=["GET"])
def get_users_temp():
    users = list(temp_users_collection.find({}, {"_id": 0}))
    return jsonify({"users": users})

@app.route("/users-temp", methods=["POST"])
def add_user_to_temp():
    new_user = request.json
    temp_users_collection.insert_one(new_user)
    send_welcome_email(new_user['eMail'], new_user['name'])

    return jsonify({"message": "User added successfully"}), 201


@app.route("/users", methods=["POST"])
def add_user():
    new_user = request.json
    users_collection.insert_one(new_user)

    return jsonify({"message": "User added successfully"}), 201

@app.route("/users", methods=["DELETE"])
def delete_user():
    name = request.json.get('name')
    lastName = request.json.get('lastName')
    eMail = request.json.get('eMail')
    password = request.json.get('password')

    result = users_collection.delete_one({"name": name, "lastName": lastName, "eMail": eMail, "password": password})

    if result.deleted_count > 0:
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404


@app.route("/users-temp", methods=["DELETE"])
def delete_user_temp():
    name = request.json.get('name')
    lastName = request.json.get('lastName')
    eMail = request.json.get('eMail')
    password = request.json.get('password')

    result = temp_users_collection.delete_one({"name": name, "lastName": lastName, "eMail": eMail, "password": password})

    if result.deleted_count > 0:
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404
    
@app.route("/users", methods=["PATCH"])
def update_user():
    name = request.json.get('name')
    lastName = request.json.get('lastName')
    eMail = request.json.get('eMail')
    password = request.json.get("password")
    new_data = request.json.get('newData', {})

    result = users_collection.update_one(
        {"name": name, "lastName": lastName, "eMail": eMail, "password": password},
        {"$set": new_data}
    )

    if result.matched_count > 0:
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404

@app.route('/verify-number', methods=['GET'])
def get_random_number():
    verification_code
    return jsonify({'random_number': verification_code})


@app.route("/user-cart", methods=["GET"])
def get_user_cart():
    cart = list(carts_collection.find({}, {"_id": 0}))
    return jsonify({"cart": cart})

@app.route("/user-cart", methods=["POST"])
def post_cart():
    new_cart = request.json
    carts_collection.insert_one({"items": new_cart})

    return jsonify({"message": "Cart added successfully"}), 201


if __name__ == "__main__":
    app.run(debug=True)

