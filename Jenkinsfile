pipeline {
    agent { node { label "jenkins-jnlp-fe" } }

    environment {
    harbor_prod = 'harbor.weimeng-hosp.com'
    harbor_test = 'harbor-test.weimeng-hosp.com'
    harbor_dev = 'harbor-test.weimeng-hosp.com'
    harbor_secret = 'myregistrykey'
    svc_tag = 1
    rs_num = 1
    cpu = "100m"
    memory = "512Mi"
    }

    stages {
      stage('Prepare') {
        steps {
        echo "1. Prepare Stage"
        checkout scm
        script {
            build_tag = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
            build_tag = "${env.BRANCH_NAME}-${build_tag}"
            app_name = sh(returnStdout: true, script: "git config -l|grep remote.origin.url|awk -F/ '{print \$NF}'|awk -F. '{print \$1}'").trim()
        }
        }
    }

     stage('Test') {
       steps {
       echo "2. Test Stage"
       }
    }

     stage('Build') {
       steps {
       echo "3. Build jar"
       script {
        if(env.BRANCH_NAME == 'master') {
        harbor_addr = "${harbor_prod}"
        apollo_env = 'pro'
        } else if(env.BRANCH_NAME == 'test') {
        harbor_addr = "${harbor_test}"
        apollo_env = 'dev'
        } else if(env.BRANCH_NAME == 'dev') {
        harbor_addr = "${harbor_test}"
        apollo_env = 'dev'
        } else if(env.BRANCH_NAME == 'pre') {
        harbor_addr = "${harbor_prod}"
        apollo_env = 'pre'
        } else {
        echo 'Unknow BRANCH_NAME !'}
        image_name = "${harbor_addr}/ioht-${env.BRANCH_NAME}/${app_name}:${build_tag}"

      sh """
         cnpm install && cnpm run build
         """
        }
       }
     }


     stage('Push') {
        steps {
        echo "4. Push Docker Image Stage"

        withCredentials([usernamePassword(credentialsId: 'harbor', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
            sh """
            cp -a /opt/k8s/* ./ \
            && docker login ${harbor_addr} -u ${dockerHubUser} -p ${dockerHubPassword} \
            && docker build -t ${image_name} . \
            && docker push ${image_name}
            """
        }
        }
     }

     stage('Deploy') {
       steps {
       echo "6. Deploy Stage"
       script {
         if (env.BRANCH_NAME == 'master') {
            input "确认要部署线上环境吗？"
        }
        }
        sh """
           if kubectl get deploy ${app_name} -n ioht-${env.BRANCH_NAME}; then
             kubectl set image deploy ${app_name} ${app_name}=${image_name} -n ioht-${env.BRANCH_NAME} --record
           else
             sed -i "s/<APP_NAME>/${app_name}/g" deploy.yaml \
             && sed -i "s/<HARBOR_ADDR>/${harbor_addr}/g" deploy.yaml \
             && sed -i "s/<NS_NAME>/ioht-${env.BRANCH_NAME}/g" deploy.yaml \
             && sed -i "s/<BUILD_TAG>/${build_tag}/g" deploy.yaml \
             && sed -i "s/<HARBOR_SECRET>/${harbor_secret}/g" deploy.yaml \
             && sed -i "s/<RS>/${rs_num}/g" deploy.yaml \
             && sed -i "s/<CPU>/${cpu}/g" deploy.yaml \
             && sed -i "s/<MEM>/${memory}/g" deploy.yaml \
             && sed -i "s/<NGX-CONF>/${app_name}-nginx/g" deploy.yaml \
             && kubectl apply -f deploy.yaml --record
             if [ ${svc_tag} -eq 1 ]; then
               sed -i "s/<APP_NAME>/${app_name}/g" svc.yaml \
               && sed -i "s/<NS_NAME>/ioht-${env.BRANCH_NAME}/g" svc.yaml \
               && kubectl apply -f svc.yaml
             fi
           fi
        """
       }
       }
}
}