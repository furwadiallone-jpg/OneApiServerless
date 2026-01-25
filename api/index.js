const express = require("express");
const app = express();
const path = require('path');
const ytmp3 = require("./savetube.js");
const {aichat,interactive} = require('./aitoxic.js');
const tikwm = require('./tikwm.js');
const ig = require('./ig.js');
const yt = require('./yt.js');
const fb = require('./fb.js');
const {getBuffer} = require('./myfunc.js');
const downloaderyt = require('./downloaderyt.js');
const downloadFileAsBuffer = require('./downloadFileAsBuffer.js');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve static files (CSS, images, etc.) from the 'public' directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
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

app.get('/download/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
const respon = await downloadFileAsBuffer(q)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

app.get('/getbuffer/:id', async (req,res) => {
const q = req.query.data
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

app.get('/ai/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
const respon = await aichat(q)
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

app.get('/ytmp3/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
const respon = await ytmp3(q,"128","audio")
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

app.get('/tiktok/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
const respon = await tikwm(q)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

app.get('/ig/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
const respon = await ig(q,baseUrl)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

app.get('/fb/:id', async (req,res) => {
const q = req.query.data
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

app.get('/yta/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
const respon = await yta(q,baseUrl)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

app.get('/ytv/:id', async (req,res) => {
const q = req.query.data
const emulate = () =>{
async function start() {
try{
let baseUrl = `${req.protocol}://${req.headers.host}`
const respon = await ytv(q,baseUrl)
  res.send(respon)
}catch(e){
    res.end()
}
}
start()
}
emulate()
});

app.listen(3000, () => console.log("Server ready on port 3000"));

module.exports = app;
