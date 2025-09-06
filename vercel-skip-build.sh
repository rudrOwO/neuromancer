if [[ $VERCEL_GIT_COMMIT_REF != "main" && $VERCEL_GIT_COMMIT_REF != "dev" ]]; then
  echo "Skipping build for $VERCEL_GIT_COMMIT_REF branch"
  exit 0
fi

exit 1
