from app import app
from extensions import db
from models import User


def main():
    print("=" * 50)
    print("Create Public Transport Admin")
    print("=" * 50)

    name = input("Admin name: ").strip()
    email = input("Admin email: ").strip().lower()
    password = input("Admin password: ")
    confirm_password = input("Confirm password: ")

    if not name:
        print("Error: name is required.")
        return

    if not email:
        print("Error: email is required.")
        return

    if len(password) < 8:
        print("Error: password must be at least 8 characters.")
        return

    if password != confirm_password:
        print("Error: passwords do not match.")
        return

    with app.app_context():

        user = User.query.filter_by(email=email).first()

        if user:
            user.name = name
            user.role = "ADMIN"
            user.set_password(password)

            db.session.commit()

            print()
            print("Existing user promoted to ADMIN successfully.")

        else:
            admin = User(
                name=name,
                email=email,
                role="ADMIN"
            )

            admin.set_password(password)

            db.session.add(admin)
            db.session.commit()

            print()
            print("Admin account created successfully.")


if __name__ == "__main__":
    main()