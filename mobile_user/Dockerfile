FROM azabost/android-sdk-28

RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g yarn && npm cache clean -f

# ——————————
# Installs Gradle
# ——————————

# Gradle
ENV GRADLE_VERSION 4.7

RUN cd /usr/lib \
 && curl -fl https://downloads.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -o gradle-bin.zip \
 && unzip "gradle-bin.zip" \
 && ln -s "/usr/lib/gradle-${GRADLE_VERSION}/bin/gradle" /usr/bin/gradle \
 && rm "gradle-bin.zip"

# Set Appropriate Environmental Variables
ENV GRADLE_HOME /usr/lib/gradle
ENV PATH $PATH:$GRADLE_HOME/bin

# ——————————
# Install React-Native package
# ——————————
WORKDIR /usr/src/app/mobile

COPY package*.json /usr/src/app/mobile/

RUN npm i
RUN npm install --global react-native-cli
RUN npm install react-navigation

COPY . /usr/src/app/mobile

WORKDIR /usr/src/app/mobile/android

#RUN bash "./gradlew task"