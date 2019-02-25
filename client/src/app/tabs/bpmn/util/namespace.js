/**
 * Copyright (c) Camunda Services GmbH.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Parser
} from 'saxen';

class NamespaceUtil {
  /**
   * @public
   *
   * Find namespace prefixes for given namespace and whether target namespace is the seeked one.
   * @param {string} xml
   * @param {string} seekedNamespace
   *
   * @returns {{ prefixes: string[], targetNamespace: boolean }}
   */
  find(xml, seekedNamespace) {
    let foundPrefixes = [],
        targetNamespace = false;

    const parser = new Parser();

    parser.on('error', function() {
      foundPrefixes = [];
      targetNamespace = false;

      parser.stop();
    });

    parser.on('openTag', (_, getAttributes) => {

      const attributes = getAttributes();

      targetNamespace = this.checkTargetNamespace(attributes, seekedNamespace);

      const namespaceAttributes = this.findNamespaceAttributes(attributes, seekedNamespace);

      foundPrefixes = this.getNamespacePrefixes(namespaceAttributes);

      // only parse first tag
      parser.stop();
    });

    parser.parse(xml);

    return {
      prefixes: foundPrefixes,
      targetNamespace
    };
  }


  /**
   * @public
   *
   * Replace prefixes and namespace url with given values.
   * @param {string}   xml
   * @param {Object}   options
   * @param {string[]} options.oldPrefixes,
   * @param {string}   options.newPrefix,
   * @param {string}   options.oldNamespaceUrl,
   * @param {string}   options.newNamespaceUrl
   *
   * @returns {string}
   */
  replace(xml, {
    oldPrefixes,
    newPrefix,
    oldNamespaceUrl,
    newNamespaceUrl
  }) {
    const convertedXML = this.replacePrefixes(xml, oldPrefixes, newPrefix, oldNamespaceUrl);

    return this.replaceNamespaceURL(convertedXML, oldNamespaceUrl, newNamespaceUrl);
  }

  checkTargetNamespace(attributes, namespace) {
    return attributes.targetNamespace === namespace;
  }

  findNamespaceAttributes(attributes, seekedNamespace) {
    const results = [];

    for (const name in attributes) {
      if (attributes[name] === seekedNamespace) {
        results.push(name);
      }
    }

    return results;
  }

  getNamespacePrefixes(attributes) {
    return attributes.filter(name => name !== 'targetNamespace' && name.startsWith('xmlns'))
      .map(name => name.split(':')[1]);
  }

  replacePrefixes(xml, oldPrefixes, newPrefix, oldNamespaceUrl) {
    const patterns = [
      new RegExp('(xmlns:)[A-z0-9.-]+(="' + oldNamespaceUrl + '")')
    ];

    oldPrefixes.forEach(prefix => {
      patterns.push(
        new RegExp('(\\s)' + prefix + '(:[A-z0-9-.]+)', 'g'),
        new RegExp('(<|</)' + prefix + '(:[A-z0-9-.]+(>|\\s))', 'g')
      );
    });

    const convertedXML = patterns.reduce((currentXML, pattern) => {
      return currentXML.replace(pattern, '$1' + newPrefix + '$2');
    }, xml);

    return convertedXML;
  }

  replaceNamespaceURL(xml, oldNamespaceUrl, newNamespaceUrl) {
    var pattern = new RegExp(oldNamespaceUrl, 'g');

    return xml.replace(pattern, newNamespaceUrl);
  }
}


export default new NamespaceUtil();
