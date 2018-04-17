# Tweets Map

A google map application that uses tweet locations.

## Features
- Able to search tweets by keyword or text.
- Able to search tweets in a selected area on map.
- Able to find the location of selected tweet.
- Also, able to search tweets from twitter by keyword or text and store them to MongoDB.

### Prerequisites

NodeJS should be installed.

### Installing
*Map Application*
```
node server.js
```
Then the application is ready.
```
http://localhost:9001
```

*Datafill Application*
Change the keywords in data_collector/server.js.
And then,
```
node data_collector/server.js
```

## Examples

###Results for search **"music"**
![alt text](https://github.com/balki7/TwitterMapSelector/blob/master/doc/img3.png)
![alt text](https://github.com/balki7/TwitterMapSelector/blob/master/doc/img4.png)
![alt text](https://github.com/balki7/TwitterMapSelector/blob/master/doc/img5.png)

###Selecting a search area
![alt text](https://github.com/balki7/TwitterMapSelector/blob/master/doc/img6.png)

###Results of selection
![alt text](https://github.com/balki7/TwitterMapSelector/blob/master/doc/img7.png)

###Info box sample
![alt text](https://github.com/balki7/TwitterMapSelector/blob/master/doc/img9.png)

## Author
Cavide Balkı GEMİRTER - 2018
