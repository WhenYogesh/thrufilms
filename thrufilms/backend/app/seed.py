"""
Seed script — populates the database with fake users, profiles, posts, and votes.
Runs automatically on startup if the DB is empty.
"""
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.profile import Profile
from app.models.post import Post
from app.models.vote import Vote
from app.models.comment import Comment
from app.services.auth_service import hash_password

# ─── Fake Users ───────────────────────────────────────────────
FAKE_USERS = [
    {
        "email": "arjun.mehta@thrufilms.in",
        "role": "filmmaker",
        "profile": {
            "name": "Arjun Mehta",
            "bio": "Indie filmmaker based in Mumbai. Currently working on my third short film about urban isolation.",
            "location": "Mumbai",
            "skills": ["Direction", "Screenwriting", "Editing"],
        },
    },
    {
        "email": "priya.sharma@thrufilms.in",
        "role": "actor",
        "profile": {
            "name": "Priya Sharma",
            "bio": "Theatre-trained actor with 5 years of experience in Hindi and Marathi cinema. Open to auditions.",
            "location": "Mumbai",
            "skills": ["Acting", "Stunt"],
        },
    },
    {
        "email": "karthik.rajan@thrufilms.in",
        "role": "crew",
        "profile": {
            "name": "Karthik Rajan",
            "bio": "Cinematographer & DOP. I love capturing natural light. Available for projects in South India.",
            "location": "Chennai",
            "skills": ["Cinematography (DOP)", "Color Grading", "Photography"],
        },
    },
    {
        "email": "sneha.nair@thrufilms.in",
        "role": "filmmaker",
        "profile": {
            "name": "Sneha Nair",
            "bio": "Award-winning documentary filmmaker. Exploring stories of resistance and resilience across India.",
            "location": "Kochi",
            "skills": ["Direction", "Producing", "Screenwriting"],
        },
    },
    {
        "email": "rohan.das@thrufilms.in",
        "role": "crew",
        "profile": {
            "name": "Rohan Das",
            "bio": "Professional video editor specializing in color grading and post-production for indie films.",
            "location": "Kolkata",
            "skills": ["Editing", "Color Grading", "VFX"],
        },
    },
    {
        "email": "ananya.reddy@thrufilms.in",
        "role": "actor",
        "profile": {
            "name": "Ananya Reddy",
            "bio": "Model-turned-actress. Featured in 10+ ad films and 3 short films. Based in Hyderabad.",
            "location": "Hyderabad",
            "skills": ["Acting", "Makeup"],
        },
    },
    {
        "email": "vikram.singh@thrufilms.in",
        "role": "crew",
        "profile": {
            "name": "Vikram Singh",
            "bio": "Sound designer and music composer with a home studio. Working on film scores since 2019.",
            "location": "Delhi",
            "skills": ["Sound Design", "Music Composition"],
        },
    },
    {
        "email": "deepika.joshi@thrufilms.in",
        "role": "filmmaker",
        "profile": {
            "name": "Deepika Joshi",
            "bio": "First-time filmmaker looking to direct my debut feature. Passionate about women-centric stories.",
            "location": "Pune",
            "skills": ["Direction", "Screenwriting", "Producing"],
        },
    },
    {
        "email": "aditya.kumar@thrufilms.in",
        "role": "crew",
        "profile": {
            "name": "Aditya Kumar",
            "bio": "VFX artist with experience in Blender and After Effects. Worked on 5 indie sci-fi shorts.",
            "location": "Bangalore",
            "skills": ["VFX", "Editing", "Color Grading"],
        },
    },
    {
        "email": "meera.patel@thrufilms.in",
        "role": "actor",
        "profile": {
            "name": "Meera Patel",
            "bio": "Gujarati theatre artist transitioning to screen. Looking for meaningful roles in indie cinema.",
            "location": "Ahmedabad",
            "skills": ["Acting"],
        },
    },
    {
        "email": "rahul.verma@thrufilms.in",
        "role": "crew",
        "profile": {
            "name": "Rahul Verma",
            "bio": "Production designer and art director. I build worlds from scratch for indie films.",
            "location": "Jaipur",
            "skills": ["Production Design", "Costume Design"],
        },
    },
    {
        "email": "kavitha.menon@thrufilms.in",
        "role": "filmmaker",
        "profile": {
            "name": "Kavitha Menon",
            "bio": "Film school graduate from FTII. Looking to collaborate with local crew in Kerala.",
            "location": "Kochi",
            "skills": ["Direction", "Cinematography (DOP)", "Editing"],
        },
    },
    {
        "email": "sanjay.bhatt@thrufilms.in",
        "role": "crew",
        "profile": {
            "name": "Sanjay Bhatt",
            "bio": "Freelance camera operator and drone pilot. Available for shoots across North India.",
            "location": "Chandigarh",
            "skills": ["Cinematography (DOP)", "Photography"],
        },
    },
    {
        "email": "ishita.gupta@thrufilms.in",
        "role": "actor",
        "profile": {
            "name": "Ishita Gupta",
            "bio": "Delhi-based actor specializing in comedy and drama. Also write my own scripts.",
            "location": "Delhi",
            "skills": ["Acting", "Screenwriting"],
        },
    },
    {
        "email": "naveen.rao@thrufilms.in",
        "role": "filmmaker",
        "profile": {
            "name": "Naveen Rao",
            "bio": "Commercial filmmaker pivoting to narrative cinema. Building a team for my first feature.",
            "location": "Hyderabad",
            "skills": ["Direction", "Producing", "Editing"],
        },
    },
]

# ─── Fake Posts ────────────────────────────────────────────────
FAKE_POSTS = [
    {
        "title": "Looking for a lead actor for psychological thriller short film",
        "description": "We're shooting a 20-minute psychological thriller in Mumbai. Need a male lead aged 25-35 who can portray intense emotional depth. Shooting starts next month. Meals and transport provided.",
        "role_needed": "Actor",
        "location": "Mumbai",
        "budget_type": "collaboration",
        "contact": "arjun.mehta@thrufilms.in",
    },
    {
        "title": "Need a DOP for wedding documentary project",
        "description": "Working on a cinematic wedding documentary series. Looking for a cinematographer who can shoot in natural light and capture candid moments beautifully. 3-day shoot in Chennai.",
        "role_needed": "DOP / Cinematographer",
        "location": "Chennai",
        "budget_type": "paid",
        "contact": "karthik.rajan@thrufilms.in",
    },
    {
        "title": "Screenwriter needed for feature film about rural India",
        "description": "I have a story concept about a farmer's journey from despair to hope. Need an experienced screenwriter to develop the full screenplay. Remote work possible.",
        "role_needed": "Screenwriter",
        "location": "Pune",
        "budget_type": "paid",
        "contact": "deepika.joshi@thrufilms.in",
    },
    {
        "title": "VFX artist for sci-fi short film — unpaid but great portfolio piece",
        "description": "Making a 15-minute sci-fi short about a dystopian Bangalore. Need VFX for cityscapes, holograms, and a chase sequence. Great for showreel!",
        "role_needed": "VFX Artist",
        "location": "Bangalore",
        "budget_type": "unpaid",
        "contact": "aditya.kumar@thrufilms.in",
    },
    {
        "title": "Actress needed for Malayalam short film — LGBTQ+ theme",
        "description": "Casting a female lead for a sensitive LGBTQ+ themed short film set in Kochi. Must be comfortable with emotional scenes. 5-day shoot schedule.",
        "role_needed": "Actress",
        "location": "Kochi",
        "budget_type": "collaboration",
        "contact": "sneha.nair@thrufilms.in",
    },
    {
        "title": "Editor for documentary about Kolkata's street food culture",
        "description": "Shot 8 hours of footage documenting Kolkata's iconic street food vendors. Need an editor to shape it into a compelling 40-minute documentary.",
        "role_needed": "Editor",
        "location": "Kolkata",
        "budget_type": "paid",
        "contact": "rohan.das@thrufilms.in",
    },
    {
        "title": "Sound designer for horror short film",
        "description": "We've finished principal photography on a horror short set in an abandoned haveli. Need atmospheric sound design and foley work. 2-week deadline.",
        "role_needed": "Sound Engineer",
        "location": "Delhi",
        "budget_type": "paid",
        "contact": "vikram.singh@thrufilms.in",
    },
    {
        "title": "Production designer for period drama — 1940s setting",
        "description": "Pre-production for a short film set in 1940s Jaipur. Need a production designer to create authentic period sets on a tight budget.",
        "role_needed": "Production Designer",
        "location": "Jaipur",
        "budget_type": "collaboration",
        "contact": "rahul.verma@thrufilms.in",
    },
    {
        "title": "Camera operator for music video shoot",
        "description": "Shooting a hip-hop music video in Chandigarh. Need a skilled camera operator with gimbal experience. 2-day shoot, good pay.",
        "role_needed": "Camera Operator",
        "location": "Chandigarh",
        "budget_type": "paid",
        "contact": "sanjay.bhatt@thrufilms.in",
    },
    {
        "title": "Looking for comedian actors for YouTube sketch series",
        "description": "Starting a comedy sketch series on YouTube. Need 3-4 actors with good comic timing. Regular weekly shoots in Delhi. Revenue sharing model.",
        "role_needed": "Actor",
        "location": "Delhi",
        "budget_type": "collaboration",
        "contact": "ishita.gupta@thrufilms.in",
    },
    {
        "title": "Assistant Director needed for feature film debut",
        "description": "First-time feature film director looking for an experienced AD to help manage a 25-day shoot schedule in Hyderabad. Must be organized and passionate.",
        "role_needed": "Assistant Director",
        "location": "Hyderabad",
        "budget_type": "paid",
        "contact": "naveen.rao@thrufilms.in",
    },
    {
        "title": "Makeup artist for historical drama short",
        "description": "Need a makeup artist who can create period-accurate looks for a short film set during the Mughal era. 4-day shoot in Jaipur.",
        "role_needed": "Makeup Artist",
        "location": "Jaipur",
        "budget_type": "collaboration",
        "contact": "rahul.verma@thrufilms.in",
    },
    {
        "title": "Music composer for romantic indie film",
        "description": "Looking for a composer to create an original score for a romantic drama set in the Western Ghats. Guitar and flute based compositions preferred.",
        "role_needed": "Music Composer",
        "location": "Kochi",
        "budget_type": "paid",
        "contact": "kavitha.menon@thrufilms.in",
    },
    {
        "title": "Color grader for festival-bound short film",
        "description": "Our short film 'Between the Lines' has been selected for preliminary screening. Need professional color grading to elevate the visual quality before final submission.",
        "role_needed": "Color Grader",
        "location": "Mumbai",
        "budget_type": "paid",
        "contact": "arjun.mehta@thrufilms.in",
    },
    {
        "title": "Producer co-producer for micro-budget feature",
        "description": "Have a completed script and attached director. Looking for a co-producer to help with logistics and partial funding for a INR 5 lakh micro-budget feature film.",
        "role_needed": "Producer",
        "location": "Bangalore",
        "budget_type": "collaboration",
        "contact": "aditya.kumar@thrufilms.in",
    },
    {
        "title": "Actress for emotional family drama — Gujarati film",
        "description": "Casting a mother character (age 40-50) for an emotional family drama in Gujarati. Must be able to speak Gujarati fluently. 10-day shoot.",
        "role_needed": "Actress",
        "location": "Ahmedabad",
        "budget_type": "paid",
        "contact": "meera.patel@thrufilms.in",
    },
    {
        "title": "Drone operator for documentary shoot in Himalayas",
        "description": "Filming a nature documentary in Himachal Pradesh. Need an experienced drone operator with DJI Mavic 3 or equivalent. 5-day expedition.",
        "role_needed": "Camera Operator",
        "location": "Chandigarh",
        "budget_type": "paid",
        "contact": "sanjay.bhatt@thrufilms.in",
    },
    {
        "title": "Casting call — multiple roles for web series pilot",
        "description": "Casting 5 roles for a web series pilot about college life in Hyderabad. Need young actors (18-25) of all genders. Auditions this weekend.",
        "role_needed": "Actor",
        "location": "Hyderabad",
        "budget_type": "unpaid",
        "contact": "ananya.reddy@thrufilms.in",
    },
    {
        "title": "Looking for co-director for experimental art film",
        "description": "Working on an experimental non-narrative film exploring themes of memory and loss. Looking for a like-minded co-director to collaborate.",
        "role_needed": "Director",
        "location": "Kolkata",
        "budget_type": "collaboration",
        "contact": "rohan.das@thrufilms.in",
    },
    {
        "title": "Costume designer for fantasy short film",
        "description": "Creating a fantasy short film with mythological themes. Need a costume designer who can work with limited resources to create striking looks.",
        "role_needed": "Costume Designer",
        "location": "Chennai",
        "budget_type": "collaboration",
        "contact": "karthik.rajan@thrufilms.in",
    },
    {
        "title": "Photographer for BTS coverage on film set",
        "description": "Hiring a still photographer for behind-the-scenes coverage during our 15-day shoot in Mumbai. Photos will be used for marketing and press.",
        "role_needed": "Other",
        "location": "Mumbai",
        "budget_type": "paid",
        "contact": "priya.sharma@thrufilms.in",
    },
    {
        "title": "Stunt coordinator for action short film",
        "description": "Planning an action-packed short film with hand-to-hand combat sequences. Need a trained stunt coordinator to choreograph and ensure safety.",
        "role_needed": "Other",
        "location": "Delhi",
        "budget_type": "paid",
        "contact": "vikram.singh@thrufilms.in",
    },
]

FAKE_COMMENTS = [
    "This sounds amazing! I'd love to be a part of this project.",
    "Great opportunity for newcomers. Sharing with my network!",
    "I've done similar work before. Will DM you the details.",
    "What's the expected timeline for this project?",
    "Is remote collaboration possible for this role?",
    "Love the concept! The Indian film scene needs more projects like this.",
    "Can you share more about the story/script?",
    "Very interested! How do I apply?",
    "This is exactly the kind of project I've been looking for.",
    "Shared this with a friend who might be perfect for this role!",
    "What equipment are you shooting with?",
    "The budget type works for me. Let's discuss!",
    "I have experience with similar genres. Would love to connect.",
    "When are auditions happening?",
    "Is there flexibility on the shooting dates?",
]


def seed_database():
    """Seed the database with fake data if empty."""
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        user_count = db.query(User).count()
        if user_count > 0:
            print(f"[SKIP] Database already has {user_count} users -- skipping seed.")
            return

        print("[SEED] Seeding database with fake data...")

        hashed = hash_password("test1234")

        # Create users + profiles
        created_users = []
        for u_data in FAKE_USERS:
            user = User(
                email=u_data["email"],
                hashed_password=hashed,
                role=u_data["role"],
            )
            db.add(user)
            db.flush()

            p = u_data["profile"]
            seed_num = abs(hash(u_data["email"])) % 1000
            profile = Profile(
                user_id=user.id,
                name=p["name"],
                bio=p["bio"],
                location=p["location"],
                skills=p["skills"],
                profile_image_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={seed_num}",
                portfolio_urls=[],
            )
            db.add(profile)
            created_users.append(user)

        db.flush()
        print(f"   [OK] Created {len(created_users)} users with profiles")

        # Create posts (assign to random users whose email matches the contact)
        email_to_user = {u_data["email"]: created_users[i] for i, u_data in enumerate(FAKE_USERS)}
        created_posts = []

        now = datetime.utcnow()
        for i, p_data in enumerate(FAKE_POSTS):
            owner = email_to_user.get(p_data["contact"], random.choice(created_users))
            post = Post(
                user_id=owner.id,
                title=p_data["title"],
                description=p_data["description"],
                role_needed=p_data["role_needed"],
                location=p_data["location"],
                budget_type=p_data["budget_type"],
                contact=p_data["contact"],
            )
            db.add(post)
            created_posts.append(post)

        db.flush()
        print(f"   [OK] Created {len(created_posts)} posts")

        # Add random votes
        vote_count = 0
        for post in created_posts:
            # Each post gets 3-8 random votes
            voters = random.sample(created_users, min(random.randint(3, 8), len(created_users)))
            for voter in voters:
                vote_type = random.choices([1, -1], weights=[0.75, 0.25])[0]
                vote = Vote(user_id=voter.id, post_id=post.id, vote_type=vote_type)
                db.add(vote)
                vote_count += 1

        db.flush()
        print(f"   [OK] Created {vote_count} votes")

        # Add random comments
        comment_count = 0
        for post in created_posts:
            num_comments = random.randint(0, 5)
            commenters = random.sample(created_users, min(num_comments, len(created_users)))
            for commenter in commenters:
                comment = Comment(
                    user_id=commenter.id,
                    post_id=post.id,
                    content=random.choice(FAKE_COMMENTS),
                )
                db.add(comment)
                comment_count += 1

        db.flush()
        print(f"   [OK] Created {comment_count} comments")

        db.commit()
        print("[DONE] Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seed error: {e}")
        raise
    finally:
        db.close()
