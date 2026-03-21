from datetime import datetime, date, time, timedelta
from app import create_app
from models import db, Event, User, Registration, Category
import json

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.session.query(Registration).delete()
        db.session.query(Event).delete()
        db.session.query(User).delete()
        db.session.query(Category).delete()
        db.session.commit()
        
        print("Seeding categories...")
        categories = [
            Category(
                name='Music',
                description='Concerts, performances, and musical events',
                icon='Music',
                image_url='https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
                event_count=0
            ),
            Category(
                name='Career',
                description='Career fairs, networking events, and professional development',
                icon='Briefcase',
                image_url='https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
                event_count=0
            ),
            Category(
                name='Arts',
                description='Art exhibitions, theater, and cultural events',
                icon='Palette',
                image_url='https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop',
                event_count=0
            ),
            Category(
                name='Technology',
                description='Hackathons, tech talks, and innovation events',
                icon='Code',
                image_url='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
                event_count=0
            ),
            Category(
                name='Sports',
                description='Sports events, fitness activities, and tournaments',
                icon='Trophy',
                image_url='https://images.unsplash.com/photo-1461896836934- voices-7fbfbf69b9b8?w=600&h=400&fit=crop',
                event_count=0
            ),
            Category(
                name='Culture',
                description='Cultural festivals, food events, and community gatherings',
                icon='Users',
                image_url='https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400&fit=crop',
                event_count=0
            )
        ]
        
        for cat in categories:
            db.session.add(cat)
        db.session.commit()
        
        print("Seeding events...")
        
        # Calculate dates
        today = date.today()
        next_week = today + timedelta(days=7)
        next_month = today + timedelta(days=30)
        
        events = [
            Event(
                title='Spring Music Festival',
                description='Join us for the biggest musical celebration of the year! Featuring live performances from student bands, professional artists, and special guest DJs. Food trucks, merchandise stalls, and interactive activities throughout the evening.',
                date=next_week,
                start_time=time(18, 0),
                end_time=time(22, 0),
                location='University Amphitheater',
                category='Music',
                image_url='https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop',
                organizer='Student Activities Board',
                contact_email='events@university.edu',
                max_attendees=1000,
                current_attendees=0,
                highlights=json.dumps(['8+ live performances', 'Food trucks & refreshments', 'Free entry for students', 'Photo booths & giveaways']),
                is_featured=True,
                status='upcoming'
            ),
            Event(
                title='Tech Career Fair 2024',
                description='Connect with top tech companies and explore internship and job opportunities. Bring your resume and prepare for on-site interviews. Companies attending include Google, Microsoft, Amazon, and 50+ startups.',
                date=today + timedelta(days=14),
                start_time=time(11, 0),
                end_time=time(16, 0),
                location='Student Center Ballroom',
                category='Career',
                image_url='https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
                organizer='Career Services Center',
                contact_email='career@university.edu',
                max_attendees=500,
                current_attendees=0,
                highlights=json.dumps(['50+ companies', 'Resume review sessions', 'Mock interviews', 'Networking lunch']),
                is_featured=True,
                status='upcoming'
            ),
            Event(
                title='Contemporary Art Exhibition',
                description='Experience the works of emerging student artists in this semester\'s contemporary art exhibition. Featuring paintings, sculptures, digital art, and interactive installations. Opening night includes artist talks and refreshments.',
                date=today + timedelta(days=10),
                start_time=time(17, 0),
                end_time=time(20, 0),
                location='Fine Arts Gallery',
                category='Arts',
                image_url='https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=600&fit=crop',
                organizer='Art Department',
                contact_email='art@university.edu',
                max_attendees=200,
                current_attendees=0,
                highlights=json.dumps(['Student artwork showcase', 'Artist talks', 'Interactive installations', 'Free refreshments']),
                is_featured=False,
                status='upcoming'
            ),
            Event(
                title='Hackathon 2024: Code for Change',
                description='48-hour hackathon focused on building solutions for social good. Form teams, brainstorm ideas, and build prototypes. Prizes include cash awards, internship opportunities, and tech gadgets.',
                date=today + timedelta(days=21),
                start_time=time(9, 0),
                end_time=time(9, 0),
                location='Engineering Building',
                category='Technology',
                image_url='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
                organizer='Computer Science Club',
                contact_email='csclub@university.edu',
                max_attendees=150,
                current_attendees=0,
                highlights=json.dumps(['48-hour coding challenge', 'Mentorship from industry experts', '$5000 in prizes', 'Free meals and swag']),
                is_featured=True,
                status='upcoming'
            ),
            Event(
                title='International Food Festival',
                description='Taste cuisines from around the world prepared by student cultural organizations. Over 20 food stalls representing 15+ countries. Live cooking demonstrations and cultural performances throughout the day.',
                date=today + timedelta(days=28),
                start_time=time(12, 0),
                end_time=time(18, 0),
                location='Campus Quad',
                category='Culture',
                image_url='https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
                organizer='International Student Association',
                contact_email='isa@university.edu',
                max_attendees=800,
                current_attendees=0,
                highlights=json.dumps(['20+ food stalls', '15+ countries represented', 'Live cooking demos', 'Cultural performances']),
                is_featured=True,
                status='upcoming'
            ),
            Event(
                title='Spring Theater Production: Romeo and Juliet',
                description='The Drama Department presents a modern adaptation of Shakespeare\'s classic tragedy. Six performances over one week with a talented cast of student actors.',
                date=today + timedelta(days=35),
                start_time=time(19, 30),
                end_time=time(21, 30),
                location='Drama Theater',
                category='Arts',
                image_url='https://images.unsplash.com/photo-1503095392237-fc55088350b9?w=800&h=600&fit=crop',
                organizer='Drama Department',
                contact_email='drama@university.edu',
                max_attendees=300,
                current_attendees=0,
                highlights=json.dumps(['Modern adaptation', 'Student cast & crew', 'Six performances', 'Talk-back sessions']),
                is_featured=False,
                status='upcoming'
            ),
            Event(
                title='Basketball Tournament',
                description='Annual 3v3 basketball tournament open to all students. Form your team and compete for the championship trophy. Prizes for winners and runners-up.',
                date=today + timedelta(days=5),
                start_time=time(10, 0),
                end_time=time(17, 0),
                location='Recreation Center',
                category='Sports',
                image_url='https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop',
                organizer='Athletics Department',
                contact_email='athletics@university.edu',
                max_attendees=200,
                current_attendees=0,
                highlights=json.dumps(['3v3 format', 'Open to all skill levels', 'Trophies and prizes', 'Free t-shirts']),
                is_featured=False,
                status='upcoming'
            ),
            Event(
                title='AI and Machine Learning Workshop',
                description='Learn the fundamentals of artificial intelligence and machine learning in this hands-on workshop. No prior experience required. Bring your laptop and get ready to code!',
                date=today + timedelta(days=12),
                start_time=time(14, 0),
                end_time=time(17, 0),
                location='Computer Lab 302',
                category='Technology',
                image_url='https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop',
                organizer='AI Research Group',
                contact_email='ai@university.edu',
                max_attendees=50,
                current_attendees=0,
                highlights=json.dumps(['Hands-on coding', 'No experience needed', 'Free resources', 'Certificate of completion']),
                is_featured=False,
                status='upcoming'
            )
        ]
        
        for event in events:
            db.session.add(event)
        db.session.commit()
        
        print("Seeding users...")
        users = [
            User(
                student_id='S12345678',
                first_name='John',
                last_name='Doe',
                email='john.doe@university.edu',
                phone='555-0101',
                major='Computer Science',
                year='junior'
            ),
            User(
                student_id='S87654321',
                first_name='Jane',
                last_name='Smith',
                email='jane.smith@university.edu',
                phone='555-0102',
                major='Business Administration',
                year='senior'
            ),
            User(
                student_id='S11223344',
                first_name='Michael',
                last_name='Johnson',
                email='michael.j@university.edu',
                phone='555-0103',
                major='Mechanical Engineering',
                year='sophomore'
            ),
            User(
                student_id='S44332211',
                first_name='Emily',
                last_name='Williams',
                email='emily.w@university.edu',
                phone='555-0104',
                major='Psychology',
                year='freshman'
            ),
            User(
                student_id='S55667788',
                first_name='David',
                last_name='Brown',
                email='david.brown@university.edu',
                phone='555-0105',
                major='Fine Arts',
                year='senior'
            )
        ]
        
        for user in users:
            db.session.add(user)
        db.session.commit()
        
        print("Seeding registrations...")
        registrations = [
            Registration(event_id=1, user_id=1, status='confirmed'),
            Registration(event_id=1, user_id=2, status='confirmed'),
            Registration(event_id=2, user_id=1, status='confirmed'),
            Registration(event_id=3, user_id=5, status='confirmed'),
            Registration(event_id=4, user_id=1, status='confirmed'),
            Registration(event_id=4, user_id=3, status='confirmed'),
            Registration(event_id=5, user_id=2, status='confirmed'),
            Registration(event_id=5, user_id=4, status='confirmed'),
        ]
        
        for reg in registrations:
            db.session.add(reg)
            # Update event attendee count
            event = Event.query.get(reg.event_id)
            if event:
                event.current_attendees += 1
        
        db.session.commit()
        
        # Update category event counts
        for category in Category.query.all():
            category.event_count = Event.query.filter_by(category=category.name).count()
        db.session.commit()
        
        print("Database seeded successfully!")
        print(f"Created {Category.query.count()} categories")
        print(f"Created {Event.query.count()} events")
        print(f"Created {User.query.count()} users")
        print(f"Created {Registration.query.count()} registrations")

if __name__ == '__main__':
    seed_database()
