"use strict";

const express = require("express");
const { Subscriber, Unsubscriber, Category } = require("../model/subscribers");
const router = express.Router();

router.get("/subscribers", async (req, res) => {
  const selectedMailingList = req.query.selectedMailingList.split(",");
  try {
    const subscribers = await Subscriber.find({
      subscription: { $in: selectedMailingList },
    });
    res.status(200).send(subscribers);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/subscribers/all", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).send(subscribers);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

/**
 * Validates the input data.
 * @param {string} email - The email address.
 * @param {string} name - The subscriber's name.
 * @param {Array} subscriptions - The array of subscriptions.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
function validateInput(email, name, subscriptions) {
  return email && name && subscriptions && Array.isArray(subscriptions);
}

/**
 * Checks if the email has a valid format.
 * @param {string} email - The email address.
 * @returns {boolean} True if the email has a valid format, false otherwise.
 */
function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Checks if a subscriber with the given email already exists.
 * @param {string} email - The email address.
 * @returns {Promise<Object>} The existing subscriber or null if not found.
 */
async function checkExistingSubscriber(email) {
  return await Subscriber.findOne({ email });
}

/**
 * Creates a new subscriber object.
 * @param {string} email - The email address.
 * @param {string} name - The subscriber's name.
 * @param {Array} subscriptions - The array of subscriptions.
 * @returns {Object} The new subscriber object.
 */
function createNewSubscriber(email, name, subscriptions) {
  return new Subscriber({
    email,
    name,
    subscription: subscriptions,
  });
}

/**
 * Handles the common logic for adding or editing a subscriber.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {boolean} isEdit - Indicates whether it's an edit operation.
 */
async function handleSubscriberRequest(req, res, isEdit) {
  try {
    const { email, name, subscriptions } = req.body;

    const isValidInput = validateInput(email, name, subscriptions);
    if (!isValidInput) {
      return res.status(400).json({ message: "Bad Request: Invalid input" });
    }

    if (!isValidEmailFormat(email)) {
      return res
        .status(400)
        .json({ message: "Bad Request: Invalid email format" });
    }

    const existingSubscriber = await checkExistingSubscriber(email);

    if (existingSubscriber) {
      if (
        existingSubscriber.subscription.includes(subscriptions[0]) &&
        !isEdit
      ) {
        return res.status(202).json({
          message: "Subscriber already subscribed to particular list",
        });
      }

      if (isEdit) {
        existingSubscriber.subscription = Array.from(
          new Set([...existingSubscriber.subscription, ...subscriptions])
        );

        await existingSubscriber.save();
        res
          .status(200)
          .json({ message: "Subscriptions added to existing subscriber" });
      } else {
        res.status(400).json({ message: "Bad Request: Email already used" });
      }
    } else {
      const newSubscriber = createNewSubscriber(email, name, subscriptions);
      await newSubscriber.save();
      res.status(200).json({
        message: isEdit ? "Subscriber updated" : "New subscriber added",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Handles the POST request to add a new subscriber.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
router.post("/subscribers/add", async (req, res) => {
  await handleSubscriberRequest(req, res, true);
});

/**
 * Handles the PUT request to edit a subscriber's information.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
router.put("/subscribers/edit", async (req, res) => {
  await handleSubscriberRequest(req, res, true);
});

router.get("/:subscriber/subs", async (req, res) => {
  const { subscriber } = req.params;

  try {
    const sub = await Subscriber.findOne({ _id: subscriber });

    if (!sub) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    return res.status(200).send(sub);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.put("/subscribers/add", async (req, res) => {
  const { name, email, subscriptions } = req.body;
  
  try {
    const subscriber = await Subscriber.findOne({ email: email });
    if (!subscriber) {
      await Subscriber.create({
        name: name,
        email: email,
        subscription: subscriptions,
      });

      return res.status(200).send({ message: "Subscriber added" });
    } else {
      const newSubscriptions = [...subscriber.subscription, ...subscriptions];
      subscriber.subscription = newSubscriptions;
      await subscriber.save();

      return res.status(200).send({ message: "Subscriber updated" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/change/:subscriber", async (req, res) => {
  const prevEmail = req.params.subscriber;
  const { name, email } = req.body;

  try {
    const selectedSubscriber = await Subscriber.findOne({
      email: prevEmail,
    });

    if (!selectedSubscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Bad Request: Invalid email format" });
    }

    selectedSubscriber.name = name;
    selectedSubscriber.email = email;

    await selectedSubscriber.save();

    res.status(200).json({ message: "Subscriber updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update/:list", async (req, res) => {
  const prevList = req.params.list;
  const { name } = req.body;

  try {
    const subscribers = await Subscriber.find({ subscription: prevList });

    if (!name) {
      return res.status(400).send({ message: "No new name provided" });
    }

    if (name === prevList) {
      return res.status(400).send({ message: "New name is the same" });
    }

    if (name.trim() !== name) {
      return res.status(400).send({ message: "New name contains spaces" });
    }

    if (
      subscribers.some((subscriber) => subscriber.subscription.includes(name))
    ) {
      return res.status(400).send({ message: "New name already exists" });
    }

    const updatedSubscribers = subscribers.map((subscriber) => {
      const index = subscriber.subscription.indexOf(prevList);
      if (index !== -1) {
        const updatedSubscription = [...subscriber.subscription];
        updatedSubscription[index] = name;
        subscriber.subscription = updatedSubscription;
      }
      return subscriber;
    });

    await Promise.all(
      updatedSubscribers.map((subscriber) => subscriber.save())
    );

    res.status(200).json({ message: "Subscriber updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//TODO subscriber
router.delete("/unsubscribe", async (req, res) => {
  const { email } = req.body;
  try {
    const subscriber = await Subscriber.findOneAndDelete({
      email: email,
    });
    if (!subscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }
    return res.status(200).send({ message: "Subscriber removed" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//TODO subscriber
router.delete("/unsubscribe/subs", async (req, res) => {
  const { email, subscriptions } = req.body;

  try {
    const subscriber = await Subscriber.findOne({ email: email });

    if (!subscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    if (subscriptions && subscriptions.length > 0) {
      subscriber.subscription = subscriber.subscription.filter(
        (subscription) => !subscriptions.includes(subscription)
      );
    } else {
      return res.status(400).send({ message: "No subscriptions provided" });
    }

    await subscriber.save();

    return res
      .status(200)
      .send({ message: "subscriptions removed successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/unsubscribe/:subscription", async (req, res) => {
  const { subscription } = req.params;

  try {
    const subscribers = await Subscriber.find({ subscription: subscription });

    if (subscribers.length === 0) {
      return res.status(404).send({ message: "No subscribers found" });
    }

    for (const subscriber of subscribers) {
      subscriber.subscription = subscriber.subscription.filter(
        (sub) => sub !== subscription
      );
      await subscriber.save();
    }

    return res
      .status(200)
      .send({ message: "Subscription removed for all subscribers" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
