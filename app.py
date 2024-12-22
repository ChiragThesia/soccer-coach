import streamlit as st
import streamlit_authenticator as stauth
import yaml
from yaml.loader import SafeLoader
import pandas as pd
from datetime import datetime
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

# Initialize MongoDB connection with error handling
try:
    mongodb_uri = os.getenv("MONGODB_URI")
    if not mongodb_uri:
        st.error(
            "MongoDB URI not found. Please set the MONGODB_URI environment variable."
        )
        st.stop()

    client = MongoClient(mongodb_uri)
    # Verify connection
    client.admin.command("ping")
    db = client["soccer_coach"]
    users_collection = db["users"]
    progress_collection = db["progress"]
except Exception as e:
    st.error(f"Failed to connect to MongoDB: {str(e)}")
    st.stop()

# Configure the page
st.set_page_config(
    page_title="Soccer Skills Tracker",
    page_icon="⚽",
    layout="wide",
    menu_items={
        "Get Help": "https://github.com/yourusername/soccer-coach",
        "Report a bug": "https://github.com/yourusername/soccer-coach/issues",
        "About": "# Soccer Skills Tracker\nHelping young athletes track their progress!",
    },
)

# Load authentication config
try:
    with open("config.yaml") as file:
        config = yaml.load(file, Loader=SafeLoader)
except Exception as e:
    st.error(f"Failed to load config file: {str(e)}")
    st.stop()

# Create the authenticator
authenticator = stauth.Authenticate(
    config["credentials"],
    config["cookie"]["name"],
    config["cookie"]["key"],
    config["cookie"]["expiry_days"],
    config["preauthorized"],
)

# Create login widget
name, authentication_status, username = authenticator.login("Login", "main")

if authentication_status == False:
    st.error("Username/password is incorrect")
elif authentication_status == None:
    st.warning("Please enter your username and password")
elif authentication_status:
    # Successful login
    authenticator.logout("Logout", "sidebar")
    st.sidebar.title(f"Welcome {name}!")

    # Main app content
    st.title("Soccer Skills Tracker ⚽")

    # Create tabs for different sections
    tab1, tab2 = st.tabs(["Add New Record", "View Progress"])

    with tab1:
        st.header("Record New Progress")

        # Form for recording progress
        with st.form("progress_form"):
            athlete_age = st.number_input("Athlete's Age", min_value=4, max_value=18)
            juggle_count = st.number_input(
                "Number of Juggles", min_value=0, max_value=1000
            )
            kick_distance = st.number_input(
                "Kick Distance (yards)", min_value=0, max_value=100
            )
            video_proof = st.file_uploader("Upload Video Proof", type=["mp4", "mov"])

            submit_button = st.form_submit_button("Submit Progress")

            if submit_button:
                # Create progress entry
                progress_entry = {
                    "username": username,
                    "athlete_age": athlete_age,
                    "juggle_count": juggle_count,
                    "kick_distance": kick_distance,
                    "has_video": video_proof is not None,
                    "date": datetime.now(),
                }

                # Save to database
                progress_collection.insert_one(progress_entry)
                st.success("Progress recorded successfully!")

    with tab2:
        st.header("Progress History")

        # Fetch progress data for the current user
        progress_data = list(progress_collection.find({"username": username}))

        if progress_data:
            df = pd.DataFrame(progress_data)
            df["date"] = pd.to_datetime(df["date"]).dt.date

            # Display progress charts
            st.subheader("Juggling Progress")
            st.line_chart(df.set_index("date")["juggle_count"])

            st.subheader("Kicking Distance Progress")
            st.line_chart(df.set_index("date")["kick_distance"])

            # Display raw data
            st.subheader("Raw Data")
            st.dataframe(
                df[
                    [
                        "date",
                        "athlete_age",
                        "juggle_count",
                        "kick_distance",
                        "has_video",
                    ]
                ]
            )
        else:
            st.info("No progress data recorded yet. Start by adding your first record!")
