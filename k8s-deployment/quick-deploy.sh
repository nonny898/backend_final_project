#!/bin/bash

# Deploy redis slave/master and services
kubectl apply -f ./redis-master-deployment.yaml
kubectl apply -f ./redis-master-service.yaml
kubectl apply -f ./redis-slave-deployment.yaml
kubectl apply -f ./redis-slave-service.yaml

kubectl apply -f ./session-deployment.yaml
kubectl apply -f ./session-service.yaml