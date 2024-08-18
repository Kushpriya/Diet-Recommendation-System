from flask import Flask, request, render_template, session, redirect, url_for, flash
import pandas as pd

app = Flask(__name__)
app.secret_key = '82f9648b383401ed8fa9c0051467ab3a'

# Load datasets
breakfast_df = pd.read_csv('Data_set/Breakfast.csv')
lunch_df = pd.read_csv('Data_set/Lunch.csv')
dinner_df = pd.read_csv('Data_set/Dinner.csv')

def calculate_bmr(weight, height, age, gender):
    if gender == "male":
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    elif gender == "female":
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    else:
        raise ValueError("Gender must be 'male' or 'female'")

def calculate_tdee(bmr, activity_level):
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9
    }
    return bmr * activity_multipliers.get(activity_level, 1.2)

def calculate_caloric_needs(age, height, weight, activity_level, gender, goal):
    bmr = calculate_bmr(weight, height, age, gender)
    tdee = calculate_tdee(bmr, activity_level)
    
    if goal == "weight_loss":
        total_calories = tdee * 0.8
    elif goal == "weight_gain":
        total_calories = tdee + 500
    else:  # For maintenance
        total_calories = tdee
    
    return bmr, tdee, total_calories

def recommend_meals(age, height, weight, activity_level, gender, goal):
    bmr, tdee, total_calories = calculate_caloric_needs(age, height, weight, activity_level, gender, goal)
    
    proportions = {
        'normal': (0.30, 0.40, 0.30),
        'weight_loss': (0.30, 0.40, 0.30),
        'weight_gain': (0.25, 0.35, 0.40)
    }
    proportion = proportions.get(goal, (0.30, 0.40, 0.30))
    breakfast_calories = total_calories * proportion[0]
    lunch_calories = total_calories * proportion[1]
    dinner_calories = total_calories * proportion[2]

    def select_best_items(df, target_calories):
        df_shuffled = df.sample(frac=1).reset_index(drop=True)
        selected_items = []
        total_calories = 0
        for _, row in df_shuffled.iterrows():
            if total_calories + row['Calories'] <= target_calories:
                selected_items.append(row)
                total_calories += row['Calories']
            if total_calories >= target_calories:
                break
        return selected_items, total_calories

    daily_recommendations = []
    for meal_df, meal_type, target_calories in zip(
            [breakfast_df, lunch_df, dinner_df],
            ['Breakfast', 'Lunch', 'Dinner'],
            [breakfast_calories, lunch_calories, dinner_calories]):

        filtered_df = meal_df  # No filtering by preferences
        selected_items, meal_total_calories = select_best_items(filtered_df, target_calories)

        for item in selected_items:
            daily_recommendations.append({
                'Meal': meal_type,
                'Food Item': item['Food_items'],
                'Calories': item['Calories'],
                'Fats': item['Fats'],
                'Proteins': item['Proteins'],
                'Iron': item['Iron'],
                'Calcium': item['Calcium'],
                'Sodium': item['Sodium'],
                'Potassium': item['Potassium'],
                'Carbohydrates': item['Carbohydrates'],
                'Fibre': item['Fibre'],
                'VitaminD': item['VitaminD'],
                'Sugars': item['Sugars']
            })

    return daily_recommendations, bmr, tdee, total_calories

@app.route('/')
def home():
    logged_in = session.get('logged_in', False)
    print(f"Logged in status: {logged_in}")
    return render_template('home.html', logged_in=logged_in)

@app.route('/about_us')
def about_us():
    logged_in = session.get('logged_in', False)
    return render_template('about_us.html', logged_in=logged_in)

@app.route('/contact_us')
def contact_us():
    logged_in = session.get('logged_in', False)
    return render_template('contact_us.html', logged_in=logged_in)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['logged_in'] = True 
        return redirect(url_for('index'))  # Redirect to home page after login
    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        return redirect(url_for('login'))  # Redirect to the login page
    return render_template('signup.html')



@app.route('/index')
def index():
    logged_in = session.get('logged_in', False)
    return render_template('index.html', logged_in=logged_in)

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        
        if True:  
            session['email'] = email
            return redirect(url_for('create_new_password'))
        else:
            flash('Email not found', 'error')

    return render_template('forgot_password.html')

@app.route('/create-new-password', methods=['GET', 'POST'])
def create_new_password():
    if 'email' not in session:
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        if password == confirm_password:
            
            flash('Password successfully reset. Please log in with your new password.', 'success')
            session.pop('email', None)  
            return redirect(url_for('login'))
        else:
            flash('Passwords do not match', 'error')
    
    return render_template('create_new_password.html')


@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('home'))

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.form
    age = int(data.get('age'))
    height = float(data.get('height'))
    weight = float(data.get('weight'))
    activity_level = data.get('activity_level')
    gender = data.get('gender')  # 'male' or 'female'
    goal = data.get('goal')

    daily_recommendations, bmr, tdee, total_calories = recommend_meals(
        age, height, weight, activity_level, gender, goal
    )

    return render_template('recommendations.html',
                           recommendations=daily_recommendations,
                           total_calories=total_calories,
                           bmr=bmr,
                           tdee=tdee,
                           goal=goal)


if __name__ == '__main__':
    app.run(debug=True)
