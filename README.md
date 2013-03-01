snoozegmail
===========

A Google Apps Script to postpone emails for a few days or until a deadline event on Google Calendar has passed.

Features
========
* Snooze an email for a few days (up to seven)
* Snooze an email until you had on your Google Calendar an event the previous day with the word "deadline" in the title.
* Unsnooze a snoozed email when you receive a reply on that thread

Usage
=====

This can only be used on https://script.google.com. You'll need to run the setup function first to create the appropriate labels on your Gmail. Then you need to add a trigger (Resources->All your triggers) to execute the function triggerdaily once per day, preferably early in the morning before the day starts.

To snooze an email just apply the appropriate label (AfterDeadline, IfNoReply, Snooze X days) and optionally archive it. When the email gets unsnoozed it will be brought back to your inbox, will be marked unread and important.
