# 📚 Storytime

![Storytime Banner](./assets/banner.png)

## 📖 About Storytime

**Storytime** is an interactive web platform that allows users to create, share, and explore stories collaboratively. With a user-friendly interface and robust features, Storytime is the perfect place for aspiring writers and story enthusiasts to share their creations with a vibrant community.

## 🚀 Features

- **📝 Story Creation:** Easily write and format your own stories.
- **🔄 Sharing:** Publish your stories for others to read, comment, and interact with.
- **🔍 Exploration:** Browse through a vast collection of community-created stories.
- **🔒 User Authentication:** Register and log in to manage your stories and interactions securely.
- **👤 User Profiles:** Customize your profile and track your activities on the platform.
- **⭐ Favorites:** Save your favorite stories for quick and easy access.

## 🛠️ Technologies Used

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-333333?style=for-the-badge&logo=supabase&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-181717?style=for-the-badge&logo=githubpages&logoColor=white)

## 🕒 Project Duration

The **Storytime** project was developed over a period of **2 weeks**, from design conception to implementation and final testing.

## 🌐 Live Demo

- **Website:** [Storytime Live](https://your-live-site.com)

## 🎨 Design

The application’s design was created using **Figma**, enabling an intuitive and attractive interface for users. [View the Figma Prototype](https://www.figma.com/file/your-prototype-link).

## 🧪 Testing

Automated tests ensure the reliability and stability of the platform. [Learn more about the testing process](#).

## 📦 Installation (Optional)

*For those interested in exploring or contributing to the codebase.*

### 🛠️ Prerequisites

- **Node.js** and **npm** installed on your machine.
- **PostgreSQL** installed locally or a [Supabase](https://supabase.com/) account for a hosted database.

### 🔧 Step-by-Step

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-username/storytime.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd storytime
    ```

3. **Setup the Backend**

    ```bash
    cd backend
    ```

    - **Install Dependencies**

        ```bash
        npm install
        ```

    - **Configure Environment Variables**

        Create a `.env` file in the `backend` directory and add the following:

        ```env
        PORT=5000
        DATABASE_URL=your_supabase_postgresql_url
        JWT_SECRET=your_secret_key
        ```

    - **Run Database Migrations (if applicable)**

        ```bash
        npx sequelize db:migrate
        npx sequelize db:seed:all
        ```

    - **Start the Backend Server**

        ```bash
        npm start
        ```

4. **Setup the Frontend**

    Open a new terminal window and navigate to the `frontend` directory:

    ```bash
    cd frontend
    ```

    - **Install Dependencies**

        ```bash
        npm install
        ```

    - **Configure Environment Variables**

        Create a `.env.local` file in the `frontend` directory and add the following:

        ```env
        NEXT_PUBLIC_API_URL=http://localhost:5000/api
        ```

    - **Start the Frontend Server**

        ```bash
        npm run dev
        ```

5. **Access the Application**

    Open your browser and go to [http://localhost:3000](http://localhost:3000) to see Storytime in action!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve this project.

1. **Fork the Project**
2. **Create Your Feature Branch**

    ```bash
    git checkout -b feature/your-feature
    ```

3. **Commit Your Changes**

    ```bash
    git commit -m "Add some feature"
    ```

4. **Push to the Branch**

    ```bash
    git push origin feature/your-feature
    ```

5. **Open a Pull Request**

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

## 📫 Contact

For more information, feel free to reach out:

- **Email:** your-email@example.com
- **LinkedIn:** [Your LinkedIn Profile](https://www.linkedin.com/in/your-profile)
- **GitHub:** [your-username](https://github.com/your-username)

---
