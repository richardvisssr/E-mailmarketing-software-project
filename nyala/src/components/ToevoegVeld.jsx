import { useEffect, useState } from "react";

export default function ToevoegVeld(props) {
  return (
    <div>
      <div class="input-group">
        <span class="input-group-addon" id="basic-addon1">
          @
        </span>
        <input
          type="text"
          class="form-control"
          placeholder="Username"
          aria-describedby="basic-addon1"
        />
      </div>
    </div>
  );
}
