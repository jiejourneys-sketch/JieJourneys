@echo off
cd /d E:\JieJourneys

echo 🗓 正在更新 sitemap 日期...

rem 取得今天日期（格式：YYYY-MM-DD）
for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set dt=%%I
set today=%dt:~0,4%-%dt:~4,2%-%dt:~6,2%

rem 直接用 PowerShell 更新 sitemap.xml 的 <lastmod> 標籤
powershell -Command "(Get-Content sitemap.xml) -replace '<lastmod>.*?</lastmod>', ('<lastmod>' + '%today%' + '</lastmod>') | Set-Content sitemap.xml"

echo ✅ 日期更新完成：%today%

git add sitemap.xml
git commit -m "update sitemap date to %today%"
git push origin main

echo 🚀 已推送到 GitHub，Vercel 將自動部署。
pause
