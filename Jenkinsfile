#!groovy

pipeline {
  agent none
  stages {
    stage('Docker Build') {
      agent {
        dockerfile true
      }
      steps {
        sh 'docker build -t gcr.io/altenproject-205322/alten-project:v2 .'
      }
    }
  }
}
