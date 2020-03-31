#!/bin/bash

kubectl rollout restart deployment frontend-deployment
kubectl rollout restart deployment sessions-socket-deployment
kubectl rollout restart deployment oauth-deployment
kubectl rollout restart deployment files-deployment