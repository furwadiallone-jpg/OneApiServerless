const express = require("express");
const app = express();
const path = require('path');
const aitoxic = require('./aitoxic.js');
const tt = require('./tt.js');
const ig = require('./ig.js');
const yt = require('./yt.js');
const fb = require('./fb.js');
const {getBuffer} = require('./myfunc.js');
const getStream = require('./getStream.js');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/eval', (req, res) => {
    res.send(__dirname);
});

app.get('/ytget/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
const respon = await downloaderyt(q)
const parsedUrl = new URL(q);
const basehost = parsedUrl.hostname
let name = q.replace(basehost,'').replace('https://','').replace("/downloads/download.php?file=/",'')
console.log(name)
// Menambahkan header untuk mendownload file dengan nama yang benar
res.setHeader('Content-Disposition', `attachment; filename="${decodeURIComponent(name)}"`);
// Mengatur tipe konten file sebagai MP3
res.setHeader('Content-Type', 'audio/mpeg'); // Tipe MIME untuk file MP3
res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

//Universal Stream Download Helper
app.get('/stream', async (req,res) => {
const q = req.query.url
const emulate = () =>{
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
const respon = await getStream(q)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

//Universal Download Helper Unblock
app.get('/buffer', async (req,res) => {
const q = req.query.url
const emulate = () =>{
async function start() {
try{
const respon = await getBuffer(q)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

//AI Toxic
app.get('/ai', async (req,res) => {
const q = req.query.text
//console.log(q)
const emulate = () =>{
async function start() {
try{
const respon = await aitoxic(q)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

//AI Costum Karakter
app.post('/cai', async (req,res) => {
const q = req.body
const emulate = () =>{
async function start() {
try{
const respon = await interactive(q)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

//Instagram Respon Link
app.get('/ig', async (req,res) => {
const q = req.query.url
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
let respon = await ig(q);
res.json(respon)
}catch(e){
res.json({
    status : true,
    message : e.message||e.toString()
})
}
}
start()
});

//Tiktok Respon Link
app.get('/tiktok', async (req,res) => {
const q = req.query.url
const emulate = () =>{
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
const respon = await tt(q,baseUrl)
res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

//Facebook Respon Link
app.get('/fb', async (req,res) => {
const q = req.query.url
const emulate = () =>{
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
const respon = await fb(q,baseUrl)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

app.get('/yt', async (req,res) => {
const q = req.query.url
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
let respon = await yt(q);
res.json(respon)
}catch(e){
res.json({
      status : true,
      message : e.message||e.toString()
})
}
}
start()
});


app.listen(3000, () => console.log("Server ready on port 3000"));

module.exports = app;
