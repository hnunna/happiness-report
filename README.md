# Visualization of World Happiness
The narrative visualization is a representation of the happiness index of the countries in the world. It is taken from the annual world happiness report which is a publication of the United Nations Sustainable Development Solutions Network.

## Messaging
This visualization shows the happiness ranking of countries in the world and how certain factors explain the happiness of the people. 

## Narrative Structure
This visualization follows the structure of a Martini glass. The reader is presented with a map that shows countries colour coded by happiness rank and a donut chart showing the details of the happiest country. All the details are presented to the user. The user then has the option explore the details of other countries by clicking on the respective country on the map. Clicking on the country shows its details in the donut chart. User also has the option to view the data for 2018 and 2019 using a dropdown menu.

## Visual Structure
This visualization shows a choropleth map of the countries which is colour coded based on the rank. The colours range from green to red. Green colour indicates that those countries are the happiest, red indicates the saddest. This type of chart is used as it gives an overview of the countries and regions based on the colour coding. The donut chart shows how the six factors (Corruption, Generosity, GDP per capita, Healthy Life Expectancy, Freedom, Social Support) influence the happiness of a country. Donut chart is used because it depicts the relative values of these factors. It can be used to identify which factor is most influencing and which one is least influencing.
Hovering on the map shows a tooltip with country name and rank. On clicking the country on the map, we can see the corresponding values of these factors in the donut chart.  
The dropdown option on the top left of the chart allows the user to choose year 2018 or 2019. The map occupies 75% of the page and is placed that way as this gives an overview of the data and the donut chart (25 % of the page) gives details of this overview.

## Scenes
The main scenes of this visualization are:
•	Selecting a year from the dropdown displays the charts for that particular year.
•	For a selected year, a map is shown and the details of the top country are shown.
•	When any country is clicked on the map, the details (donut chart) are updated.
The scenes are ordered in way that user will first select a year, see the overall happiness ranking and then drill down into details.

## Annotations
The annotations in this visualization are:
•	The text that shows the year for which data is rendered which changes based on the year selected.
•	The Legend Happiness Ranking shows the segregation of data based on ranking range. This legend is constant throughout the scenes.
•	The legend below the donut chart shows the name of factor and its value. This is updated for each country.
•	The Text inside the donut chart represents the Country Name, Rank and its Happiness Score which is also updated when a new country is selected.
 These annotations are always present but are updated based on the scene. All these annotations present the user on the exact details that they are looking into.

## Parameters
Year and country name are the parameters. The chart is updated based on these values.
The map has an initial state showing 2019 data. The donut chart has an initial state of displaying details on the happiest country in 2019.  These states are updated based on the year and country name.

## Triggers
Selecting a value from the dropdown menu and clicking on the map are the triggers.
Selecting a value from the dropdown menu triggers the loadData() of the map which re-renders the charts based on the year values. Clicking on a country in the map calls the update() of Donut Chart which updates the values of chart based on the element that is clicked. Hovering on the map changes the cursor from pointer to clickable icon which indicates that the part of map is clickable.
