# import cv2
# import face_recognition
# import mysql.connector
# import pickle

# # MySQL Database Configuration
# DB_CONFIG = {
#     "host": "localhost",
#     "user": "root",  # Change to your MySQL username
#     "password": "",  # Change to your MySQL password
#     "database": "leave_management"
# }

# # Connect to MySQL Database
# def connect_db():
#     conn = mysql.connector.connect(**DB_CONFIG)
#     cursor = conn.cursor()
#     return conn, cursor

# # Load registered faces from MySQL
# def load_registered_faces():
#     conn, cursor = connect_db()
#     cursor.execute("SELECT reg_no, name, face_encoding FROM faceIDs")
#     known_encodings = {}
#     reg_nos = {}
    
#     for reg_no, name, enc_blob in cursor.fetchall():
#         known_encodings[name] = pickle.loads(enc_blob)
#         reg_nos[name] = reg_no
    
#     conn.close()
#     return known_encodings, reg_nos

# # Check leave status
# def check_leave_status(reg_no):
#     conn, cursor = connect_db()
#     cursor.execute("SELECT status FROM general_applications WHERE reg_no = %s", (reg_no,))
#     result = cursor.fetchone()
#     conn.close()
#     return result[0] if result else None

# # Update leave status
# def update_leave_status(reg_no):
#     conn, cursor = connect_db()
#     cursor.execute("UPDATE general_applications SET status = 'Leaved' WHERE reg_no = %s", (reg_no,))
#     conn.commit()
#     conn.close()

# # Recognize face from the camera
# def recognize_face():
#     known_encodings, reg_nos = load_registered_faces()
#     cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    
#     print("Scanning for faces...")
#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break
        
#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         face_locations = face_recognition.face_locations(rgb_frame, model="hog")
#         face_encodings = face_recognition.face_encodings(rgb_frame, face_locations, num_jitters=2)
        
#         for face_encoding, face_location in zip(face_encodings, face_locations):
#             name = "Unknown"
#             reg_no = None
            
#             for stored_name, stored_encodings in known_encodings.items():
#                 matches = face_recognition.compare_faces(stored_encodings, face_encoding, tolerance=0.35)
#                 if any(matches):
#                     name = stored_name
#                     reg_no = reg_nos[name]
#                     break
            
#             if name == "Unknown":
#                 print("Face not recognized.")
#             else:
#                 leave_status = check_leave_status(reg_no)
#                 if leave_status == "WApproved":
#                     update_leave_status(reg_no)
#                     print(f"Face recognized: {name}, Registration Number: {reg_no}. Leave status updated to 'Leaved'.")
#                 elif leave_status == None :
#                     print(f"Face recognized: {name}, Registration Number: {reg_no}. No Leave Request Found.")
                
#                 cap.release()
#                 cv2.destroyAllWindows()
#                 return
        
#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == "__main__":
#     recognize_face()






# import cv2
# import face_recognition
# import mysql.connector
# import pickle

# # MySQL Database Configuration
# DB_CONFIG = {
#     "host": "localhost",
#     "user": "root",  # Change to your MySQL username
#     "password": "password",  # Change to your MySQL password
#     "database": "face_recognition_db"
# }

# # Connect to MySQL Database
# def connect_db():
#     conn = mysql.connector.connect(**DB_CONFIG)
#     cursor = conn.cursor()
#     return conn, cursor

# # Load registered faces from MySQL
# def load_registered_faces():
#     conn, cursor = connect_db()
#     cursor.execute("SELECT reg_no, name, face_encoding FROM faceIDs")
#     known_encodings = {}
#     reg_nos = {}
    
#     for reg_no, name, enc_blob in cursor.fetchall():
#         known_encodings[name] = pickle.loads(enc_blob)
#         reg_nos[name] = reg_no
    
#     conn.close()
#     return known_encodings, reg_nos

# # Check leave status
# def check_leave_status(reg_no):
#     conn, cursor = connect_db()
#     cursor.execute("SELECT status FROM general_applications WHERE reg_no = %s", (reg_no,))
#     result = cursor.fetchone()
#     conn.close()
#     return result[0] if result else None

# # Update leave status
# def update_leave_status(reg_no):
#     conn, cursor = connect_db()
#     cursor.execute("UPDATE general_applications SET status = 'leaved' WHERE reg_no = %s", (reg_no,))
#     conn.commit()
#     conn.close()

# # Recognize face from the camera
# def recognize_face():
#     known_encodings, reg_nos = load_registered_faces()
#     cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    
#     print("Scanning for faces...")
#     while True:
#         ret, frame = cap.read()
#         if not ret:
#             break
        
#         rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         face_locations = face_recognition.face_locations(rgb_frame, model="hog")
#         face_encodings = face_recognition.face_encodings(rgb_frame, face_locations, num_jitters=2)
        
#         for face_encoding, face_location in zip(face_encodings, face_locations):
#             name = "Unknown"
#             reg_no = None
            
#             for stored_name, stored_encodings in known_encodings.items():
#                 matches = face_recognition.compare_faces(stored_encodings, face_encoding, tolerance=0.35)
#                 if any(matches):
#                     name = stored_name
#                     reg_no = reg_nos[name]
#                     break
            
#             if name == "Unknown":
#                 print("Face not recognized.")
#             else:
#                 leave_status = check_leave_status(reg_no)
#                 if leave_status == "WApproved":
#                     update_leave_status(reg_no)
#                     print(f"Face recognized: {name}, Registration Number: {reg_no}. Leave status updated to 'leaved'.")
#                 else:
#                     print(f"Face recognized: {name}, Registration Number: {reg_no}. Leave not approved yet.")
                
#                 cap.release()
#                 cv2.destroyAllWindows()
#                 return
        
#     cap.release()
#     cv2.destroyAllWindows()

# if __name__ == "__main__":
#     recognize_face()


import cv2
import face_recognition
import mysql.connector
import pickle
import smtplib
from email.mime.text import MIMEText  # Correct import
from email.mime.multipart import MIMEMultipart  # Correct import
from datetime import datetime

# MySQL Database Configuration
DB_CONFIG = {
    "host": "localhost",
    "user": "root",  # Change to your MySQL username
    "password": "password",  # Change to your MySQL password
    "database": "leave_management"
}

# Email Configuration
EMAIL_CONFIG = {
    "smtp_server": "smtp.gmail.com",  # For Gmail
    "smtp_port": 587,
    "sender_email": "harshcarpenter06902@gmail.com",  # Change to your email
    "sender_password": "hbxw hxbh qjuy dgwi",  # Change to your app password
    "receiver_email": "sumitsharma8764@gmail.com"
}

# Connect to MySQL Database
def connect_db():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    return conn, cursor

# Load registered faces from MySQL
def load_registered_faces():
    conn, cursor = connect_db()
    cursor.execute("SELECT reg_no, name, face_encoding FROM faceIDs")
    known_encodings = {}
    reg_nos = {}
    
    for reg_no, name, enc_blob in cursor.fetchall():
        known_encodings[name] = pickle.loads(enc_blob)
        reg_nos[name] = reg_no
    
    conn.close()
    return known_encodings, reg_nos

# Check leave status
def check_leave_status(reg_no):
    conn, cursor = connect_db()
    cursor.execute("SELECT status FROM general_applications WHERE reg_no = %s", (reg_no,))
    result = cursor.fetchone()
    conn.close()
    return result[0] if result else None

# Update leave status
def update_leave_status(reg_no):
    conn, cursor = connect_db()
    cursor.execute("UPDATE general_applications SET status = 'leaved' WHERE reg_no = %s", (reg_no,))
    conn.commit()
    conn.close()

# Send email notification
def send_leave_notification(student_name, reg_no):
    try:
        # Create message
        message = MIMEMultipart()  # Correct class name
        message["From"] = EMAIL_CONFIG["sender_email"]
        message["To"] = EMAIL_CONFIG["receiver_email"]
        message["Subject"] = "Campus Leave Notification"
        
        # Get current date and time
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Email body
        body = f"""
        Dear Parent/Guardian,
        
        This is to inform you that your ward has left the campus.
        
        Student Details:
        - Name: {student_name}
        - Registration Number: {reg_no}
        - Departure Time: {current_time}
        
        Please note that the student has officially checked out of the campus premises.
        
        Best regards,
        Campus Security System
        """
        
        message.attach(MIMEText(body, "plain"))  # Correct class name
        
        # Create SMTP session
        server = smtplib.SMTP(EMAIL_CONFIG["smtp_server"], EMAIL_CONFIG["smtp_port"])
        server.starttls()  # Enable security
        server.login(EMAIL_CONFIG["sender_email"], EMAIL_CONFIG["sender_password"])
        
        # Send email
        text = message.as_string()
        server.sendmail(EMAIL_CONFIG["sender_email"], EMAIL_CONFIG["receiver_email"], text)
        server.quit()
        
        print(f"Email notification sent successfully to {EMAIL_CONFIG['receiver_email']}")
        return True
        
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

# Recognize face from the camera
def recognize_face():
    known_encodings, reg_nos = load_registered_faces()
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    
    print("Scanning for faces...")
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_frame, model="hog")
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations, num_jitters=2)
        
        for face_encoding, face_location in zip(face_encodings, face_locations):
            name = "Unknown"
            reg_no = None
            
            for stored_name, stored_encodings in known_encodings.items():
                matches = face_recognition.compare_faces(stored_encodings, face_encoding, tolerance=0.35)
                if any(matches):
                    name = stored_name
                    reg_no = reg_nos[name]
                    break
            
            if name == "Unknown":
                print("Face not recognized.")
            else:
                leave_status = check_leave_status(reg_no)
                if leave_status == "WApproved":
                    update_leave_status(reg_no)
                    print(f"Face recognized: {name}, Registration Number: {reg_no}. Leave status updated to 'leaved'.")
                    
                    # Send email notification
                    email_sent = send_leave_notification(name, reg_no)
                    if email_sent:
                        print("Parent/guardian has been notified via email.")
                    else:
                        print("Failed to send email notification, but leave status was updated.")
                        
                else:
                    print(f"Face recognized: {name}, Registration Number: {reg_no}. Leave not approved yet.")
                
                cap.release()
                cv2.destroyAllWindows()
                return
        
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    recognize_face()