# connect
API to create new user

      POST http://localhost:3000/api/connect/user

              The API should receive the following JSON request:
                {"name":"lisa","email":"lisa@connect.com"}

API to Fetch all User

      GET http://localhost:3000/api/connect/users

—————————————————————————————————————————————

1.API to create a friend connection between two email addresses.

	     http://localhost:3000/api/connect/addfriend

                The API should receive the following JSON request:
                {
                  friends:
                    [
                      'andy@connect.com',
                      'john@connect.com'
                    ]
                }
                The API should return the following JSON response on success:
                {
                     "success": "true",
                     "detail": "andy@connect.com and john@connect.com are friends now"
                }


2.API to retrieve the friends list for an email address.

	    http://localhost:3000/api/connect/user
    
                  The API should receive the following JSON request:
                  {
                    email: 'andy@connect.com'
                  }
                  The API should return the following JSON response on success:
                  {
                    "success": true,
                    "friends" :
                      [
                        'john@connect.com'
                      ],
                    "count" : 1   
                  }


3.API to retrieve the common friends list between two email addresses.
             
      http://localhost:3000/api/connect/mutualfriend
           
                  The API should receive the following JSON request:
                  {
                    friends:
                      [
                        'andy@connect.com',
                        'john@connect.com'
                      ]
                  }
                  The API should return the following JSON response on success:
                  {
                    "success": true,
                    "friends" :
                      [
                        'common@connect.com'
                      ],
                    "count" : 1   
                  }


4.API to subscribe to updates from an email address

	    http://localhost:3000/api/connect/subscribe
       
                  The API should receive the following JSON request:
                  {
                    "requestor": "lisa@connect.com",
                    "target": "john@connect.com"
                  }
                  The API should return the following JSON response on success:
                  {
                    "success": true
                  }


5.API to block updates from an email address.

    	http://localhost:3000/api/connect/block

                  The API should receive the following JSON request:
                  {
                    "requestor": "andy@connect.com",
                    "target": "john@connect.com"
                  }
                  The API should return the following JSON response on success:
                  {
                    "success": true
                  }


6. API to retrieve all email addresses that can receive updates from an email address.

       http://localhost:3000/api/connect/recieveupdates

                  The API should receive the following JSON request:
                  {
                    "sender":  "john@connect.com",
                    "text": "Hello World! kate@connect.com"
                  }
                  The API should return the following JSON response on success:
                  {
                    "success": true
                    "recipients":
                      [
                        "lisa@connect.com",
                        "kate@connect.com"
                      ]
                  }



