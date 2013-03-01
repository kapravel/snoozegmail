// this is used to check if a reply was made by you
var MY_NAME = "PUT YOUR NAME HERE"

function setup() {
  // Create the labels we’ll need for snoozing
  GmailApp.createLabel("Snooze");
  GmailApp.createLabel("Snooze/AfterDeadline");
  for (var i = 1; i <= 7; ++i) {
    GmailApp.createLabel(getLabelName(i));
  }
  GmailApp.createLabel("Snooze/IfNoReply");
}

function getLabelName(i) {
  return "Snooze/Snooze " + i + " days";
}

function isYesterdayDeadline() {
  var cal = CalendarApp.getDefaultCalendar();
  // setup dates to get events from yesterday
  var yesterday_am = new Date();
  yesterday_am.setDate(new Date().getDate() - 1);
  yesterday_am.setHours(0,0,0,0);
  var yesterday_pm = new Date();
  yesterday_pm.setDate(yesterday_am.getDate());
  yesterday_pm.setHours(23,59,59,0);
  // iterate on yesterday's events
  var events = cal.getEvents(yesterday_am, yesterday_pm);
  for (var i = 0; i < events.length; i++) {
    // if event has in title the word deadline, then move all 
    // threads from label AfterDeadline to the Inbox, mark them unread
    // and important and clear their AfterDeadline label 
    if ( events[i].getTitle().toLowerCase().search("deadline") >= 0) {
      deadlineLabel = GmailApp.getUserLabelByName("Snooze/AfterDeadline");
      someThreads = deadlineLabel.getThreads();
      GmailApp.moveThreadsToInbox(someThreads);  
      GmailApp.markThreadsUnread(someThreads);
      GmailApp.markThreadsImportant(someThreads);
      deadlineLabel.removeFromThreads(someThreads);
    }
  }
  
}

function moveSnoozes() {
  var oldLabel, newLabel, someThreads, thisThread, lastMessage, imTheSender, labels, label;
  for (var snoozeLabelID = 1; snoozeLabelID <= 7; ++snoozeLabelID) {
    newLabel = oldLabel;
    oldLabel = GmailApp.getUserLabelByName(getLabelName(snoozeLabelID));
    someThreads = null;
    // Get threads in "pages" of 100 at a time
    while(!someThreads || someThreads.length == 100) {
      someThreads = oldLabel.getThreads(0, 100);
      if (someThreads.length == 0) {
        continue;
      }
      
      
      if (newLabel) {
        // Move the threads into "today’s" label
        newLabel.addToThreads(someThreads);
      } else {
        // Unless it’s time to unsnooze it
         
        // Scan them first to see if somebody doesn't need unsnoozing
        for (var threadID = 0; threadID < someThreads.length; threadID++) {
          thisThread = someThreads[threadID];
          lastMessage = thisThread.getMessages()[thisThread.getMessageCount() - 1];      
          imTheSender = (lastMessage.getFrom().search(MY_NAME) >= 0);
          
          if (!imTheSender) {
            //somebody replied
            labels = thisThread.getLabels();
            for (var labelID = 0; labelID < labels.length; labelID++) {
              label = labels[labelID];
              Logger.log(label.getName());
              if (label.getName() == "Snooze/IfNoReply") {
                // Somebody replied, and we requested to snooze only if no reply happened.
                label.removeFromThread(thisThread);
                oldLabel.removeFromThread(thisThread);
                someThreads = someThreads.splice(threadID - 1, 1);
                threadID -= 1;
                break;
              }
            }
          }
        }
      
        GmailApp.moveThreadsToInbox(someThreads);  
        GmailApp.markThreadsUnread(someThreads);
        GmailApp.markThreadsImportant(someThreads);     
         
      }     
      // Move the threads out of "yesterday’s" label
      oldLabel.removeFromThreads(someThreads);   
    }
  }
}


function triggerdaily() {
  moveSnoozes();
  isYesterdayDeadline();
}
