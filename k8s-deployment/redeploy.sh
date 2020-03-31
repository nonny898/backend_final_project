#!/bin/bash

kubectl delete deployment frontend-deployment
kubectl delete deployment files-deployment
kubectl delete deployment sessions-socket-deployment
kubectl delete deployment oauth-deployment

kubectl apply -f api-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f oauth-deployment.yaml
kubectl apply -f session-deployment.yaml