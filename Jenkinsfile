pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('Build') {
            steps {
                git 'https://github.com/BoGomolTrue/todo-list.git'
                bat 'npm install'
            }
        }
    }
}
