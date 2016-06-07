# Rindex Dynamic Value (Paw Extension)


## Introduction 
A Paw Extension that find a random index path based on another request. Also includes specific aliased index lookup.

## How to Use

Rindex includes simple index tools to load either a specific index {int}, random index {*}, or aliased index
{first @f, middle @m, last @l}. The goal is to allow a simplified way to write tests or dependent requests that
utilities a wide range of data. Randomizing the data ensures that the request will work for multiple cases derived
from the dependent result of the request set.

## Ruleset

```javascript
users[*].name; // random index of a user's name
users[*].friends[*].name; // random index of a user; and random index of that user friend's name
users[@f].name; // first index of user's name
users[@m].name; // middle index of user's name
users[@l].name; // last index of user's name
users[2].name; // third index of user's name (follows normal array access)
```

## Steps to Use

**1. Make a request for dependent data for the NEW Request**
![](/images/step1_rindex.jpg?raw=true "Step 1")

**2. From EXISTING Request copy a key path (we will change request later)**
![](/images/step2_rindex.jpg?raw=true "Step 2")

**3. In the NEW Request type the paw dynamic variable.**
![](/images/step3_rindex.jpg?raw=true "Step 3")

**4. Copy and paste the keypath from the EXISTING to the NEW Request.**
![](/images/step4_rindex.jpg?raw=true "Step 4")

**5a. Change keypath according to the rules outlined above.**
![](/images/step5_rindex.jpg?raw=true "Step 5")

### OR

![](/images/step5_alternate_rindex.jpg?raw=true "Step 5 Alternate")

## License

See [](LICENSE.md)