rm -rf build
rm -rf neudim-build

set timeout -1
npm run build
mv build neudim-build
zip -r neudim-build.zip neudim-build
echo "zip done"

expect -c "
set timeout -1
spawn scp neudim-build.zip vrlab@10.15.88.38:/home/vrlab/neudim-web-react
expect \"*password*\"
send \"vrlab123\n\"
expect eof"

expect -c "
set timeout -1
spawn ssh vrlab@10.15.88.38 \"rm -rf /home/vrlab/neudim-web-react/neudim-build\n\"
expect \"*password*\"
send \"vrlab123\n\"
expect eof
"

expect -c "
set timeout -1
spawn ssh vrlab@10.15.88.38 \"cd /home/vrlab/neudim-web-react\n unzip neudim-build.zip\n\"
expect \"*password*\"
send \"vrlab123\n\"
expect eof
"

rm neudim-build.zip