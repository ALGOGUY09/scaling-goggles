module.exports = {
  apps: [{
    name: "date-calculator",
    script: "python3",
    args: "-m http.server 3000",
    cwd: "/home/user/webapp",
    env: {
      NODE_ENV: "production"
    }
  }]
};
