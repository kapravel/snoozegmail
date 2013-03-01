snoozegmail
===========

A Google Apps Script to postpone emails for a few days or until a deadline event on Google Calendar has passed.

Usage
=====

This can only be used on https://script.google.com. You'll need to run the setup function first to create the appropriate labels on your Gmail. Then you need to add a trigger (Resources->All your triggers) to execute the function triggerdaily once per day, preferably early in the morning before the day starts.
